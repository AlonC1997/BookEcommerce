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

    @GetMapping("/getAllBooks")
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        List<BookDTO> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/getBook")
    public ResponseEntity<BookDTO> getBookById(@RequestParam Long bookId) {
        try {
            BookDTO bookDTO = bookService.getBookById(bookId);
            return ResponseEntity.ok(bookDTO);
        } catch (BookNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getStockQuantity")
    public ResponseEntity<Integer> getStockQuantity(@RequestParam Long bookId) throws BookNotFoundException {
        System.out.println("Received request for stock quantity with ID: " + bookId);
        int stockQuantity = bookService.getStockQuantity(bookId);
        System.out.println("Stock quantity for ID " + bookId + ": " + stockQuantity);
        return new ResponseEntity<>(stockQuantity, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/addBook")
    public ResponseEntity<?> addBook(@RequestBody BookDTO bookDTO) {
        bookService.addBook(bookDTO);
        return ResponseEntity.ok("Book added successfully");
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/updateBook")
    public ResponseEntity<?> updateBook(@RequestBody BookDTO bookDTO) {
        try {
            bookService.updateBook(bookDTO.getId(), bookDTO);
            return ResponseEntity.ok("Book updated successfully");
        } catch (BookNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/deleteBook")
    public ResponseEntity<?> deleteBook(@RequestParam Long bookId) {
        try {
            bookService.deleteBook(bookId);
            return ResponseEntity.ok("Book deleted successfully");
        } catch (BookNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/restoreBook")
    public ResponseEntity<?> restoreBook(@RequestParam Long bookId) {
        try {
            bookService.restoreBook(bookId);
            return ResponseEntity.ok("Book restored successfully");
        } catch (BookNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getDeletedBooks")
    public ResponseEntity<List<BookDTO>> getDeletedBooks() {
        List<BookDTO> deletedBooks = bookService.getDeletedBooks();
        return ResponseEntity.ok(deletedBooks);
    }
}
