package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Data
public class OrderDTO {
    private Long id;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long userId;

    /*private List<CartBookDTO> cartBooks;*/
    private List<OrderBookDTO> orderBooks;

    public OrderDTO() {}

    public OrderDTO(Long id, BigDecimal totalPrice, String status, LocalDateTime createdAt, LocalDateTime updatedAt, Long userId,  /*List<CartBookDTO> cartBooks*/ List<OrderBookDTO> orderBooks) {
        this.id = id;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
        /*this.cartBooks = cartBooks;*/
        this.orderBooks = orderBooks;
    }
}



