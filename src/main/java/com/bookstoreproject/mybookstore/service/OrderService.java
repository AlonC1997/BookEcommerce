package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.OrderNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.UserNotFoundException;
import com.bookstoreproject.mybookstore.dto.OrderBookDTO;
import com.bookstoreproject.mybookstore.dto.OrderDTO;
import com.bookstoreproject.mybookstore.entity.Book;
import com.bookstoreproject.mybookstore.entity.Order;
import com.bookstoreproject.mybookstore.repository.OrderRepository;
import com.bookstoreproject.mybookstore.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final BookService bookService;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        ModelMapper modelMapper,
                        BookService bookService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.bookService = bookService;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "orders", key = "#orderId")
    public OrderDTO getOrderById(Long orderId) throws OrderNotFoundException {
        return orderRepository.findById(orderId)
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
    }

    @Transactional(readOnly = true)
    public List<OrderBookDTO> getOrderBooksById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Map<Long, OrderBookDTO> bookMap = new HashMap<>();

        for (Book book : order.getBooks()) {
            OrderBookDTO dto = bookMap.get(book.getId());
            if (dto == null) {
                dto = new OrderBookDTO();
                dto.setBookId(book.getId());
                dto.setBookName(book.getName());
                dto.setPrice(book.getPrice());
                dto.setQuantity(1);
                dto.setTotalPrice(book.getPrice());
                bookMap.put(book.getId(), dto);
            } else {
                dto.setQuantity(dto.getQuantity() + 1);
                dto.setTotalPrice(dto.getTotalPrice().add(book.getPrice()));
            }
        }

        return new ArrayList<>(bookMap.values());
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrdersForUser(Long userId) throws UserNotFoundException {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable("allOrders")
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "orders", allEntries = true),
            @CacheEvict(value = "allOrders", allEntries = true)
    })
    public void deleteOrder(Long id) throws OrderNotFoundException {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));

        for (Book book : order.getBooks()) {
            bookService.increaseStockQuantity(book.getId(), 1);
        }

        orderRepository.delete(order);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "orders", key = "#orderDTO.id"),
            @CacheEvict(value = "allOrders", allEntries = true),
            @CacheEvict(value = "orderBooks", key = "#orderDTO.id")
    })
    public void updateOrder(OrderDTO orderDTO) throws OrderNotFoundException {
        Order order = orderRepository.findById(orderDTO.getId())
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderDTO.getId()));
        try {
            order.setTotalPrice(orderDTO.getTotalPrice());
            order.setStatus(Order.OrderStatus.valueOf(orderDTO.getStatus()));
            order.setUpdatedAt(orderDTO.getUpdatedAt());

            Order updatedOrder = orderRepository.save(order);
            modelMapper.map(updatedOrder, OrderDTO.class);
        } catch (ObjectOptimisticLockingFailureException ex) {
            throw new RuntimeException("Order update failed due to concurrent modification", ex);
        }
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "lastOrderIdForUser", key = "#userId")
    public Long getLastOrderIdForUser(Long userId) throws UserNotFoundException {
        // Validate user existence
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        Long maxOrderId = orderRepository.findMaxOrderIdByUserId(userId);

        if (maxOrderId == null) {
            return 0L;
        }

        return maxOrderId;
    }

    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);

        Map<Long, OrderBookDTO> bookMap = order.getBooks().stream()
                .collect(Collectors.toMap(
                        Book::getId,
                        book -> new OrderBookDTO(
                                book.getId(),
                                book.getName(),
                                book.getPrice(),
                                1,
                                book.getPrice()
                        ),
                        (existing, replacement) -> {
                            existing.setQuantity(existing.getQuantity() + 1);
                            existing.setTotalPrice(existing.getTotalPrice().add(replacement.getPrice()));
                            return existing;
                        }
                ));

        List<OrderBookDTO> orderBookDTOs = bookMap.values().stream().collect(Collectors.toList());

        orderDTO.setOrderBooks(orderBookDTOs);

        return orderDTO;
    }
}