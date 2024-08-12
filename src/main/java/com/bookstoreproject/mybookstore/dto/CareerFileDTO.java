package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class CareerFileDTO {
    private Long id;
    private String fileName;
    private String fileType;

}
