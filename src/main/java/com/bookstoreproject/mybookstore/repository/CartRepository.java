package com.bookstoreproject.mybookstore.repository;

import com.bookstoreproject.mybookstore.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Object> findByUserId(Long userId);
}
