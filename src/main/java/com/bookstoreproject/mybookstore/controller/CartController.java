package com.bookstoreproject.mybookstore.controller;

import com.bookstoreproject.mybookstore.Exceptions.BookNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.CartNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.UserNotFoundException;
import com.bookstoreproject.mybookstore.dto.CartDTO;
import com.bookstoreproject.mybookstore.service.CartService;
import com.bookstoreproject.mybookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/carts")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @Autowired
    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }


    /*
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/addOneBook")
    public ResponseEntity<?> addOneBookToCart(@RequestParam Long bookId) {
        // Retrieve authenticated user's cartId
        Long cartId = getLoggedInUserCartId();
        try {
            cartService.addOneBookToCart(cartId, bookId);
            return ResponseEntity.ok("Book added to cart successfully");
        } catch (CartNotFoundException | BookNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
*/


    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/addOneBook")
    public ResponseEntity<?> addOneBookToCart(@RequestParam Long bookId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        try {
            // Retrieve the logged-in user's cart ID
            Long cartId = userService.getLoggedInUserCartId(username);
            cartService.addBookToCart(cartId, bookId);
            return ResponseEntity.ok("Book added to cart successfully");
        } catch (CartNotFoundException | BookNotFoundException | UserNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
    public ResponseEntity<?> submitCart(@RequestParam Long cartId) {
        try {
            cartService.submitCart(cartId);
            return ResponseEntity.ok("Cart submitted successfully");
        } catch (CartNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/sumCart") //http://localhost:8080/sumCart?cartId=1 (Calling example)
    public ResponseEntity<?> sumAllCartProducts(@RequestParam Long cartId) {
        try {
            BigDecimal total = cartService.sumAllCartProducts(cartId);
            return ResponseEntity.ok("Total price of cart products: " + total);
        } catch (CartNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    @GetMapping("/getCart")
    public ResponseEntity<CartDTO> getCartById(@RequestParam Long id) {
        try {
            CartDTO cartDTO = cartService.getCartById(id);
            return ResponseEntity.ok(cartDTO);
        } catch (CartNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
