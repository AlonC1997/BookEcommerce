package com.bookstoreproject.mybookstore.controller;


import com.bookstoreproject.mybookstore.JWT.JwtGenerator;
import com.bookstoreproject.mybookstore.dto.AuthResponseDto;
import com.bookstoreproject.mybookstore.dto.LoginDto;
import com.bookstoreproject.mybookstore.dto.UserDTO;
import com.bookstoreproject.mybookstore.entity.Cart;
import com.bookstoreproject.mybookstore.entity.User;
import com.bookstoreproject.mybookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000/**")
public class AuthController {

    private UserRepository userRepository;
    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;
    private JwtGenerator jwtGenerator;

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtGenerator jwtGenerator) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);
        return new ResponseEntity<>(new AuthResponseDto(token), HttpStatus.OK);
    }

    /* This register method is only for user because there is no register for admin from frontend side! just from AdminController backend side */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {

        if (userRepository.existsByUsername(userDTO.getUsername())) {
            return new ResponseEntity<>("Username '" + userDTO.getUsername() + "' is already taken!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setName(userDTO.getName());
        user.setAddress(userDTO.getAddress());
        user.setRole("USER"); // Automatically set role to "USER"

        // Create and assign a cart to the user
        Cart cart = new Cart();
        cart.setUser(user);
        user.setCart(cart);

        userRepository.save(user); // Save user and cascade save the cart

        return new ResponseEntity<>("User registered success!", HttpStatus.OK);
    }
}