package com.bookstoreproject.mybookstore.controller;

import com.bookstoreproject.mybookstore.Exceptions.BookNotFoundException;
import com.bookstoreproject.mybookstore.dto.BookDTO;
import com.bookstoreproject.mybookstore.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:3000/**")
public class BookController {

    @Autowired
    private BookService bookService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/add_book")
    public ResponseEntity<?> addBook(@RequestBody BookDTO bookDTO) {
        bookService.addBook(bookDTO);
        return ResponseEntity.ok("Book added successfully");
    }

    //@PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getAllBooks")
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        List<BookDTO> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    //@PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getBook")
    public ResponseEntity<BookDTO> getBookById(@RequestParam Long bookId) {
        try {
            BookDTO bookDTO = bookService.getBookById(bookId);
            return ResponseEntity.ok(bookDTO);
        } catch (BookNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/deleteBook")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody BookDTO bookDTO) {
        try {
            bookService.updateBook(id, bookDTO);
            return ResponseEntity.ok("Book updated successfully");
        } catch (BookNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/deleteBook")
    public ResponseEntity<?> deleteBook(@PathVariable Long bookId) {
        try {
            bookService.deleteBook(bookId);
            return ResponseEntity.ok("Book deleted successfully");
        } catch (BookNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //@PreAuthorize("hasAuthority('USER')")
    @GetMapping("/getStockQuantity")
    public ResponseEntity<Integer> getStockQuantity(@RequestParam Long bookId) {
        System.out.println("Received request for stock quantity with ID: " + bookId);
        int stockQuantity = bookService.getStockQuantity(bookId);
        System.out.println("Stock quantity for ID " + bookId + ": " + stockQuantity);
        return new ResponseEntity<>(stockQuantity, HttpStatus.OK);
    }


}
