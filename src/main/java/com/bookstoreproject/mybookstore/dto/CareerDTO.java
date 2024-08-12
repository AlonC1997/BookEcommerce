package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@Data
public class CareerDTO {
    private Long id;
    private LocalDate datePosted;
    private boolean available;
    private String location;
    private String category;
    private String title;
    private String description;
    private String level;
    private String requirements;
    private List<CareerFileDTO> files;
}