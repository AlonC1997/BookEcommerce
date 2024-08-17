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

    @Column(name = "file_content", columnDefinition="longblob")
    private byte[] fileContent;

    private LocalDate uploadDate;

    @ManyToOne
    @JoinColumn(name = "career_id")
    private Career career;


    @Version
    @Column(nullable = false)
    private Integer version;

    private String contentType;
}
