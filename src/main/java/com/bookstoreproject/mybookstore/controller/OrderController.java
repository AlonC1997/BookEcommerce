package com.bookstoreproject.mybookstore.controller;

import com.bookstoreproject.mybookstore.Exceptions.OrderNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.UserNotFoundException;
import com.bookstoreproject.mybookstore.dto.OrderBookDTO;
import com.bookstoreproject.mybookstore.dto.OrderDTO;
import com.bookstoreproject.mybookstore.service.OrderService;
import com.bookstoreproject.mybookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/getLastOrderId")
    public ResponseEntity<?> getLastOrderIdForUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Long userId = userService.getUserIdByUsername(username);
            Long lastOrderId = orderService.getLastOrderIdForUser(userId);
            return ResponseEntity.ok(lastOrderId);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @GetMapping("/getUserOrders")
    public ResponseEntity<List<OrderDTO>> getAllOrdersForUser(@RequestParam Long userId) {
        try {
            List<OrderDTO> orders = orderService.getAllOrdersForUser(userId);
            return ResponseEntity.ok(orders);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/getUserOrdersWithOutId")
    public ResponseEntity<List<OrderDTO>> getAllOrdersWithOutId(){
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Long userId = userService.getUserIdByUsername(username);
            List<OrderDTO> orders = orderService.getAllOrdersForUser(userId);
            return ResponseEntity.ok(orders);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getOrderById")
    public ResponseEntity<?> getOrderById(@RequestParam Long orderId) {
        try {
            OrderDTO orderDTO = orderService.getOrderById(orderId);
            return ResponseEntity.ok(orderDTO);
        } catch (OrderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/updateStatus")
    public ResponseEntity<?> updateOrderStatus(@RequestParam Long orderId, @RequestParam String status) {
        try {
            orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok("Order status updated successfully");
        } catch (OrderNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getAllOrders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        System.out.println("I Got here 1!!!");
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getOrderBooksById")
    public ResponseEntity<?> getOrderBooksById(@RequestParam Long orderId) throws OrderNotFoundException {
        List<OrderBookDTO> orderBooks = orderService.getOrderBooksById(orderId);
        return ResponseEntity.ok(orderBooks);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    @DeleteMapping("/deleteOrder")
    public ResponseEntity<?> deleteOrder(@RequestParam Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok("Order deleted successfully");
        } catch (OrderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/updateOrder")
    public ResponseEntity<?> updateOrder(@RequestBody OrderDTO orderDTO) {
        try {
            orderService.updateOrder(orderDTO);
            return ResponseEntity.ok("Order updated successfully");
        } catch (OrderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }


}
