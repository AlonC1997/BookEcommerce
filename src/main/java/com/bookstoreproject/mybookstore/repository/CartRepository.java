package com.bookstoreproject.mybookstore.repository;

import com.bookstoreproject.mybookstore.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
}
