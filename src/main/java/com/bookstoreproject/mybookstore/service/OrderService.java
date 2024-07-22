package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.BookNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.OrderNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.OutOfStockException;
import com.bookstoreproject.mybookstore.Exceptions.UserNotFoundException;
import com.bookstoreproject.mybookstore.dto.CartItemDTO;
import com.bookstoreproject.mybookstore.dto.OrderDTO;
import com.bookstoreproject.mybookstore.entity.Book;
import com.bookstoreproject.mybookstore.entity.Order;
import com.bookstoreproject.mybookstore.entity.User;
import com.bookstoreproject.mybookstore.repository.BookRepository;
import com.bookstoreproject.mybookstore.repository.CartRepository;
import com.bookstoreproject.mybookstore.repository.OrderRepository;
import com.bookstoreproject.mybookstore.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Order createOrder(OrderDTO orderDTO) throws UserNotFoundException, BookNotFoundException, OutOfStockException {
        // Fetch user and validate
        User user = userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + orderDTO.getUserId()));

        // Validate cart items, deduct stock quantities, calculate total price
        List<Book> orderedBooks = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CartItemDTO cartItemDTO : orderDTO.getCartItems()) {
            Long bookId = cartItemDTO.getBookId();
            Integer quantity = cartItemDTO.getQuantity();

            // Fetch book
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));

            // Check stock availability
            if (book.getStockQuantity() < quantity) {
                throw new OutOfStockException("Not enough stock available for book: " + book.getName());
            }

            // Update stock quantity
            book.setStockQuantity(book.getStockQuantity() - quantity);
            orderedBooks.add(book);

            // Calculate total price
            totalPrice = totalPrice.add(book.getPrice().multiply(BigDecimal.valueOf(quantity)));
        }

        // Create Order entity
        Order order = new Order();
        order.setTotalPrice(totalPrice);
        order.setStatus(Order.OrderStatus.INPROCESS);
        order.setUser(user);
        order.setBooks(orderedBooks);

        // Save order
        order = orderRepository.save(order);

        return order;
    }



    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) throws OrderNotFoundException {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
        return modelMapper.map(order, OrderDTO.class);
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrdersForUser(Long userId) throws UserNotFoundException {
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
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
    public void cancelOrder(Long orderId) throws OrderNotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteOrder(Long id) throws OrderNotFoundException {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
        orderRepository.delete(order);
    }

    /*
    @Transactional
    public void updateOrder(Long id, OrderDTO orderDTO) throws OrderNotFoundException {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));

        existingOrder.setTotalPrice(orderDTO.getTotalPrice());
        existingOrder.setStatus(Order.OrderStatus.valueOf(orderDTO.getStatus()));
        existingOrder.setCreatedAt(orderDTO.getCreatedAt());
        existingOrder.setUpdatedAt(orderDTO.getUpdatedAt());


        orderRepository.save(existingOrder);
    }
    */

}
