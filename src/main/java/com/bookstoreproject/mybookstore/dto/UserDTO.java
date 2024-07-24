package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class UserDTO {
    private Long userID;
    private String name;
    private String address;
    private String username;
    private String password;
    private String role;

    public UserDTO(Long userID, String name, String address, String username,String password, String role) {
        this.userID = userID;
        this.name = name;
        this.address = address;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public UserDTO() {}
}
