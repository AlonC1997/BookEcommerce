package com.bookstoreproject.mybookstore.controller;

import com.bookstoreproject.mybookstore.Exceptions.BookNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.CartNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.UserNotFoundException;
import com.bookstoreproject.mybookstore.dto.CartDTO;
import com.bookstoreproject.mybookstore.dto.CartBookDTO;
import com.bookstoreproject.mybookstore.service.CartBookService;
import com.bookstoreproject.mybookstore.service.CartService;
import com.bookstoreproject.mybookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/carts")
@CrossOrigin(origins = "http://localhost:3000/**")
public class CartController {

    @Autowired
    private  CartService cartService;

    @Autowired
    private UserService userService;

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/addOneBook")
    public ResponseEntity<String> addOneBookToCart(@RequestParam Long bookId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            Long cartId = userService.getLoggedInUserCartId(username);
            cartService.addBookToCart(cartId, bookId);
            return ResponseEntity.ok("Book added to cart successfully");
        } catch (CartNotFoundException | BookNotFoundException | UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // For out-of-stock case
        }
    }


    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/removeBook")
    public ResponseEntity<?> removeOneBookFromCart(@RequestParam Long bookId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        try {
            // Retrieve the logged-in user's cart ID
            Long cartId = userService.getLoggedInUserCartId(username);
            cartService.removeBookFromCart(cartId, bookId);
            return ResponseEntity.ok("Book removed from cart successfully");
        } catch (CartNotFoundException | BookNotFoundException | UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/submitCart")
    public ResponseEntity<?> submitCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            Long cartId = userService.getLoggedInUserCartId(username);
            cartService.submitCart(cartId);
            return ResponseEntity.ok("Cart submitted successfully");
        } catch (CartNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/sumCart")
    public ResponseEntity<?> sumAllCartProducts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            Long cartId = userService.getLoggedInUserCartId(username);
            BigDecimal total = cartService.sumAllCartProducts(cartId);
            return ResponseEntity.ok("Total price of cart products: " + total);
        } catch (CartNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/getCartBooks")
    public List<CartBookDTO> getCartBooks() throws CartNotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Long cartId = userService.getLoggedInUserCartId(username);
        return cartService.getCartBooksByCartId(cartId);
    }
}
