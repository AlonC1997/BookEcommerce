package com.bookstoreproject.mybookstore.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "career_files", schema = "MyBookStore")
public class CareerFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Column(name = "file_content", nullable = false, columnDefinition="LONGBLOB")
    private byte[] fileContent;

    private LocalDate uploadDate;

    @ManyToOne
    @JoinColumn(name = "career_id")
    private Career career;

    private String contentType; // Add this field
}
