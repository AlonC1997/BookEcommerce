package com.bookstoreproject.mybookstore.dto;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CartBookDTO {
    private Long bookId;
    private Integer quantity;

    public CartBookDTO(Long bookId, Integer quantity) {
        this.bookId = bookId;
        this.quantity = quantity;
    }

    public CartBookDTO() {}

}