package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Data
public class CareerFileDTO {
    private Long id;
    private String fileName;
    private LocalDate uploadDate;
    private Long careerId;
    private byte[] fileContent;
    private String contentType;
}

