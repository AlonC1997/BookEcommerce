package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.*;
import com.bookstoreproject.mybookstore.dto.CartBookDTO;
import com.bookstoreproject.mybookstore.dto.OrderBookDTO;
import com.bookstoreproject.mybookstore.dto.OrderDTO;
import com.bookstoreproject.mybookstore.entity.Book;
import com.bookstoreproject.mybookstore.entity.Order;
import com.bookstoreproject.mybookstore.entity.User;
import com.bookstoreproject.mybookstore.repository.BookRepository;
import com.bookstoreproject.mybookstore.repository.OrderRepository;
import com.bookstoreproject.mybookstore.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public OrderDTO getOrderById(Long orderId) throws OrderNotFoundException {
        Optional<Order> orderOptional = orderRepository.findById(orderId);

        if (!orderOptional.isPresent()) {
            throw new OrderNotFoundException("Order not found with id: " + orderId);
        }

        Order order = orderOptional.get();
        return modelMapper.map(order, OrderDTO.class);
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

    @Transactional
    public List<OrderDTO> getAllOrdersForUser(Long userId) throws UserNotFoundException {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String status) throws OrderNotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        order.setStatus(Order.OrderStatus.valueOf(status));
        orderRepository.save(order);
    }

    @Transactional
    public List<OrderDTO> getAllOrders() {
        System.out.println("I Got here 2!!!");
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteOrder(Long id) throws OrderNotFoundException {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
        orderRepository.delete(order);
    }

    private OrderDTO convertToOrderDTO(Order order) {
        System.out.println("I Got here 3!!!");

        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        List<CartBookDTO> cartBookDTOs = order.getBooks().stream()
                .map(book -> new CartBookDTO(book.getId(), book.getName(), book.getPrice(), book.getStockQuantity()))
                .collect(Collectors.toList());
        orderDTO.setCartBooks(cartBookDTOs);
        return orderDTO;
    }

    @Transactional
    public OrderDTO updateOrder(OrderDTO orderDTO) throws OrderNotFoundException {
        Order order = orderRepository.findById(orderDTO.getId())
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderDTO.getId()));

        order.setTotalPrice(orderDTO.getTotalPrice());
        order.setStatus(Order.OrderStatus.valueOf(orderDTO.getStatus()));
        order.setUpdatedAt(orderDTO.getUpdatedAt());

        Order updatedOrder = orderRepository.save(order);
        return modelMapper.map(updatedOrder, OrderDTO.class);
    }
}
