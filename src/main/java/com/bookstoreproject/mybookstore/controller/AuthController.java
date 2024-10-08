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
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestParam;
import com.bookstoreproject.mybookstore.cofigSec.CustomUserDetailsService;
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
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtGenerator jwtGenerator) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
        this.customUserDetailsService = customUserDetailsService;

    }
/*
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);
        return new ResponseEntity<>(new AuthResponseDto(token), HttpStatus.OK);
    }
*/

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
        user.setRole("USER"); // Automatically set role to "USER" because only users can register through this method (admins are created by other main admins)

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

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate Tokens
        String accessToken = jwtGenerator.generateToken(authentication);
        String refreshToken = jwtGenerator.generateRefreshToken(authentication);

        // Set tokens as HttpOnly cookies
        setTokenCookie(response, "accessToken", accessToken, (int) jwtGenerator.JWT_EXPIRATION, true);
        setTokenCookie(response, "refreshToken", refreshToken, (int) jwtGenerator.REFRESH_EXPIRATION, true);

        return new ResponseEntity<>(new AuthResponseDto(accessToken), HttpStatus.OK);
    }


    private void setTokenCookie(HttpServletResponse response, String name, String value, int expirationMillis, boolean secure) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(secure); // Set secure based on parameter
        cookie.setPath("/");
        cookie.setMaxAge((int) (expirationMillis / 1000)); // Convert milliseconds to seconds
        response.addCookie(cookie);
    }

    /*

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDto> refreshToken(@CookieValue("refreshToken") String refreshToken, HttpServletResponse response) {
        if (jwtGenerator.validateRefreshToken(refreshToken)) {
            String username = jwtGenerator.getUsernameFromJWT(refreshToken);

            // Load user details and generate a new access token
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    username, null, customUserDetailsService.loadUserByUsername(username).getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String newAccessToken = jwtGenerator.generateToken(authentication);

            // Set new access token as a cookie
            setTokenCookie(response, "accessToken", newAccessToken, (int) jwtGenerator.JWT_EXPIRATION, true); // Adjust 'true' based on your environment

            return new ResponseEntity<>(new AuthResponseDto(newAccessToken), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
*/

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDto> refreshToken(@CookieValue("refreshToken") String refreshToken, HttpServletResponse response) {
        try {
            if (jwtGenerator.validateRefreshToken(refreshToken)) {
                String username = jwtGenerator.getUsernameFromJWT(refreshToken);

                // Load user details and generate a new access token
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        username, null, customUserDetailsService.loadUserByUsername(username).getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String newAccessToken = jwtGenerator.generateToken(authentication);

                // Set new access token as a cookie
                setTokenCookie(response, "accessToken", newAccessToken, (int) jwtGenerator.JWT_EXPIRATION, true); // Adjust 'true' based on your environment

                return new ResponseEntity<>(new AuthResponseDto(newAccessToken), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }



}
