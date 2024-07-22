package com.bookstoreproject.mybookstore.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class UserDTO {
    private Long id;
    private String name;
    private String address;
    private String username;
    private String password;

    public UserDTO(Long id, String name, String address, String username,String password) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.username = username;
        this.password = password;
    }

    public UserDTO() {}
}
