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
    private List<CartItemDTO> cartItems;

    public CartDTO(Long cartID, Instant dateCreated, Long userId, List<CartItemDTO> cartItems) {
        this.cartID = cartID;
        this.dateCreated = dateCreated;
        this.userId = userId;
        this.cartItems = cartItems;
    }

    public CartDTO() {}
}
