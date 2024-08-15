package com.bookstoreproject.mybookstore.repository;

import com.bookstoreproject.mybookstore.entity.Order;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Lock(LockModeType.PESSIMISTIC_READ)
    List<Order> findByUserId(Long userId);

    @Query("SELECT MAX(o.id) FROM Order o WHERE o.user.id = :userId")
    Long findMaxOrderIdByUserId(@Param("userId") Long userId);
}
