package com.bookstoreproject.mybookstore.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "career_files", schema = "MyBookStore")
public class CareerFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Lob
    @Column(nullable = false)
    private byte[] fileContent;

    @ManyToOne
    @JoinColumn(name = "career_id", nullable = false)
    private Career career;
}
