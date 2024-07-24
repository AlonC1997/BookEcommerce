package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@Data
public class BookDTO {
    private Long id;
    private String name;
    private String author;
    private BigDecimal price;
    private Integer stockQuantity;
    private String img_link;
    private String description;
    private String category;
    private Boolean isDeleted;

    public BookDTO(Long id, String name, String author, BigDecimal price, Integer stockQuantity, String img_link, String description, String category) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.img_link = img_link;
        this.description = description;
        this.category = category;
        this.isDeleted = false;
    }

    public BookDTO() {}
}
