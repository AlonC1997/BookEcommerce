package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.BookNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.ResourceNotFoundException;
import com.bookstoreproject.mybookstore.dto.BookDTO;
import com.bookstoreproject.mybookstore.entity.Book;
import com.bookstoreproject.mybookstore.repository.BookRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;

    public BookService(BookRepository bookRepository, ModelMapper modelMapper) {
        this.bookRepository = bookRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional(readOnly = true)
    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .filter(book -> !book.getIsDeleted())
                .map(book -> modelMapper.map(book, BookDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookDTO getBookById(Long id) throws BookNotFoundException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        return modelMapper.map(book, BookDTO.class);
    }

    @Transactional(readOnly = true)
    public List<BookDTO> getDeletedBooks() {
        return bookRepository.findAll().stream()
                .filter(Book::getIsDeleted)
                .map(book -> modelMapper.map(book, BookDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public int getStockQuantity(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return book.getStockQuantity();
    }

    @Transactional
    public void addBook(BookDTO bookDTO) {
        Book book = modelMapper.map(bookDTO, Book.class);
        book.setIsDeleted(false);
        bookRepository.save(book);
    }

    @Transactional
    public void updateBook(Long id, BookDTO bookDTO) throws BookNotFoundException {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));

        modelMapper.map(bookDTO, existingBook); // Use ModelMapper to copy properties

        bookRepository.save(existingBook);
    }

    @Transactional
    public void deleteBook(Long id) throws BookNotFoundException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        book.setIsDeleted(true);
        bookRepository.save(book);
    }

    @Transactional
    public void restoreBook(Long id) throws BookNotFoundException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        book.setIsDeleted(false);
        bookRepository.save(book);
    }

    @Transactional
    public void decreaseStockQuantity(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        if (book.getStockQuantity() > 0) {
            book.setStockQuantity(book.getStockQuantity() - 1);
            bookRepository.save(book);
        } else {
            throw new IllegalArgumentException("Stock quantity cannot be less than zero");
        }
    }

    @Transactional
    public void increaseStockQuantity(Long id, int quantity) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        book.setStockQuantity(book.getStockQuantity() + quantity);
        bookRepository.save(book);
    }
}
