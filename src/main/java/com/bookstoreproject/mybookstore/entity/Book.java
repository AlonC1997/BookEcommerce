package com.bookstoreproject.mybookstore.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "books", schema = "MyBookStore")
public class Book implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column
    private String author;

    @Column
    //@Min(1)
    private Integer stockQuantity;

    @Column
    private BigDecimal price;

    @Column(length = 1000) // Adjust this length as needed
    private String description;

    @Column
    private String img_link;  // URL to the product image

    @Column
    private String category;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "books")
    private List<Cart> carts;

    @ManyToMany(mappedBy = "books")
    private List<Order> orders;

    @Column
    private Boolean isDeleted = false;

    @Version
    @Column(nullable = false)
    private Integer  version;

    public Book() {}
}
