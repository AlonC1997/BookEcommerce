package com.bookstoreproject.mybookstore.controller;

import com.bookstoreproject.mybookstore.Exceptions.UserNotFoundException;
import com.bookstoreproject.mybookstore.dto.UpdateAddressDTO;
import com.bookstoreproject.mybookstore.dto.UpdateNameDTO;
import com.bookstoreproject.mybookstore.dto.UserDTO;
import com.bookstoreproject.mybookstore.entity.User;
import com.bookstoreproject.mybookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    @GetMapping("/getUser")
    public ResponseEntity<UserDTO> getUserById(@RequestParam Long userId) {
        try {
            UserDTO userDTO = userService.getUserById(userId);
            return ResponseEntity.ok(userDTO);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    @PutMapping("/updateUser")
    public ResponseEntity<?> updateUser(@RequestParam Long userId, @RequestBody UserDTO userDTO) {
        try {
            userService.updateUser(userId, userDTO);
            return ResponseEntity.ok("User updated successfully");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(@RequestParam Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    @PostMapping("/addAdmin")
    public ResponseEntity<Object> addAdmin(@RequestBody User admin) {
        User createdAdmin = userService.addAdmin(admin.getUsername(), admin.getPassword(), admin.getAddress(), admin.getName(), admin.getRole());
        if (createdAdmin != null) {
            return ResponseEntity.ok("Admin was Saved!");
        }
        return ResponseEntity.status(404).body("Error 404, User not Saved!");
    }

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN') or hasAuthority('MAIN_ADMIN')")
    @GetMapping("/getLoggedInUser")
    public ResponseEntity<UserDTO> getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            UserDTO userDTO = userService.getUserByUsername(username);
            return ResponseEntity.ok(userDTO);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN') or hasAuthority('MAIN_ADMIN')")
    @GetMapping("/getLoggedInUserId")
    public ResponseEntity<Long> getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            Long userId = userService.getUserIdByUsername(username);
            return ResponseEntity.ok(userId);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN') or hasAuthority('MAIN_ADMIN')")
    @PostMapping("/setName")
    public ResponseEntity<String> setName(@RequestBody UpdateNameDTO updateNameDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            userService.updateName(username, updateNameDTO.getName());
            return ResponseEntity.ok("Name updated successfully");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN') or hasAuthority('MAIN_ADMIN')")
    @PostMapping("/setAddress")
    public ResponseEntity<String> setAddress(@RequestBody UpdateAddressDTO updateAddressDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            userService.updateAddress(username, updateAddressDTO.getAddress());
            return ResponseEntity.ok("Address updated successfully");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
