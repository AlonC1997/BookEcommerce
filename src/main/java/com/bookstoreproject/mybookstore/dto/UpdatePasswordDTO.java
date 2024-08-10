package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class UpdatePasswordDTO {
    private String password;
}
