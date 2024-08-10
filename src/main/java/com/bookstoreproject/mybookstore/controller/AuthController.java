package com.bookstoreproject.mybookstore.controller;

import com.bookstoreproject.mybookstore.Exceptions.UserNotFoundException;
import com.bookstoreproject.mybookstore.JWT.JwtGenerator;
import com.bookstoreproject.mybookstore.dto.AuthResponseDto;
import com.bookstoreproject.mybookstore.dto.LoginDto;
import com.bookstoreproject.mybookstore.dto.UpdatePasswordDTO;
import com.bookstoreproject.mybookstore.dto.UserDTO;
import com.bookstoreproject.mybookstore.entity.Cart;
import com.bookstoreproject.mybookstore.entity.User;
import com.bookstoreproject.mybookstore.repository.UserRepository;
import com.bookstoreproject.mybookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;

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


    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserDTO userDTO, BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();
            result.getAllErrors().forEach(error -> errorMsg.append(error.getDefaultMessage()).append(" "));
            return new ResponseEntity<>(errorMsg.toString().trim(), HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByUsername(userDTO.getUsername())) {
            return new ResponseEntity<>("Username '" + userDTO.getUsername() + "' is already taken!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setName(userDTO.getName());
        user.setAddress(userDTO.getAddress());
        user.setRole("USER"); // Automatically set role to "USER"

        Cart cart = new Cart();
        cart.setUser(user);
        user.setCart(cart);

        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully!", HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam("username") String username) {
        boolean userExists = userService.checkIfUserExists(username);

        if (userExists) {
            // Logic to send a password reset link to the user's email
            return ResponseEntity.ok("Thank you! We have sent a link to " + username + " to reset your password.");
        } else {
            return ResponseEntity.badRequest().body("Email not found. Please check the email address and try again.");
        }
    }

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN') or hasAuthority('MAIN_ADMIN')")
    @PostMapping("/setNewPassword")
    public ResponseEntity<String> setNewPassword(@RequestBody UpdatePasswordDTO updatePasswordDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            userService.updatePassword(username, updatePasswordDTO.getPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
