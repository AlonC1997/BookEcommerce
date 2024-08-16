package com.bookstoreproject.mybookstore.repository;

import com.bookstoreproject.mybookstore.entity.CareerFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerFileRepository extends JpaRepository<CareerFile, Long> {
}