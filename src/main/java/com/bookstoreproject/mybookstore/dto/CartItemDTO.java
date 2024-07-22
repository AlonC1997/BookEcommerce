package com.bookstoreproject.mybookstore.dto;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CartItemDTO {
    private Long bookId;
    private Integer quantity;

    public CartItemDTO(Long bookId, Integer quantity) {
        this.bookId = bookId;
        this.quantity = quantity;
    }

}