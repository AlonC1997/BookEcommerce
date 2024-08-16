package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Data
public class OrderBookDTO {
    private Long bookId;
    private String bookName;
    private BigDecimal price;
    private int quantity;
    private BigDecimal totalPrice;

    public OrderBookDTO(Long bookId, String bookName, BigDecimal price, Integer quantity, BigDecimal totalPrice) {
        this.bookId = bookId;
        this.bookName = bookName;
        this.price = price;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

    public OrderBookDTO() {}

    public OrderBookDTO(Long id, String name, BigDecimal price) {
        this.bookId = id;
        this.bookName = name;
        this.price = price;
    }
}
