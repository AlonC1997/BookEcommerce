package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Setter
@Getter
@Data
public class CartDTO {
    private Long cartID;
    private Instant dateCreated;
    private Long userId;
    private List<CartBookDTO> cartBooks;

    public CartDTO(Long cartID, Instant dateCreated, Long userId, List<CartBookDTO> cartBooks) {
        this.cartID = cartID;
        this.dateCreated = dateCreated;
        this.userId = userId;
        this.cartBooks = cartBooks;
    }

    public CartDTO() {}
}
