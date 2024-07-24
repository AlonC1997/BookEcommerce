package com.bookstoreproject.mybookstore.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "orders", schema = "MyBookStore")
public class Order implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
            name = "orders_books",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    private List<Book> books = new ArrayList<>();

    public enum OrderStatus {
        CANCELLED,
        READY,
        ARRIVED,
        INPROCESS
    }

    public Order() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now(ZoneId.of("Asia/Jerusalem"));
        updatedAt = OffsetDateTime.now(ZoneId.of("Asia/Jerusalem"));
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now(ZoneId.of("Asia/Jerusalem"));
    }
}
