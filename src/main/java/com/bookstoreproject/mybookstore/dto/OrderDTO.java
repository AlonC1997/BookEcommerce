package com.bookstoreproject.mybookstore.dto;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Setter
@Getter
@Data
public class OrderDTO {
    private Long userId;
    private List<CartItemDTO> cartItems;

    public OrderDTO() {}

    public OrderDTO(Long userId, List<CartItemDTO> cartItems) {
        this.userId = userId;
        this.cartItems = cartItems;
    }
}
