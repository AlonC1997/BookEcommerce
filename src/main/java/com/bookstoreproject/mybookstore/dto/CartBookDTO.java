package com.bookstoreproject.mybookstore.dto;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@Data
public class CartBookDTO {
    private Long bookId;
    private String bookName;
    private BigDecimal price;
    private Integer quantity;

    public CartBookDTO(Long bookId, String bookName, BigDecimal price, Integer quantity) {
        this.bookId = bookId;
        this.bookName = bookName;
        this.price = price;
        this.quantity = quantity;
    }

    public CartBookDTO() {}
}
