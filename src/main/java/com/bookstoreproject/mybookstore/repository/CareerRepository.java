package com.bookstoreproject.mybookstore.repository;

import com.bookstoreproject.mybookstore.entity.Career;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerRepository extends JpaRepository<Career, Long> {
}
