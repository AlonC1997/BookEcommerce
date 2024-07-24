package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Setter
@Getter
@Data
public class OrderDTO {
    private Long id;
    private BigDecimal totalPrice;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private Long userId;
    private List<CartBookDTO> cartBooks;

    public OrderDTO() {}

    public OrderDTO(Long id, BigDecimal totalPrice, String status, OffsetDateTime createdAt, OffsetDateTime updatedAt, Long userId, List<CartBookDTO> cartBooks) {
        this.id = id;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
        this.cartBooks = cartBooks;
    }
}
