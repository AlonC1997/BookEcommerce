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
    public ResponseEntity<BookDTO> getBookById(@RequestParam Long id) {
        try {
            BookDTO bookDTO = bookService.getBookById(id);
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
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.ok("Book deleted successfully");
        } catch (BookNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getStockQuantity")
    public ResponseEntity<Integer> getStockQuantity(@RequestParam Long id) {
        System.out.println("Received request for stock quantity with ID: " + id);
        int stockQuantity = bookService.getStockQuantity(id);
        System.out.println("Stock quantity for ID " + id + ": " + stockQuantity);
        return new ResponseEntity<>(stockQuantity, HttpStatus.OK);
    }


}
