package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.BookNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.ResourceNotFoundException;
import com.bookstoreproject.mybookstore.dto.BookDTO;
import com.bookstoreproject.mybookstore.entity.Book;
import com.bookstoreproject.mybookstore.repository.BookRepository;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.dao.OptimisticLockingFailureException;
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
    @Cacheable(value = "books", key = "'allBooks'")
    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .filter(book -> !book.getIsDeleted())
                .map(book -> modelMapper.map(book, BookDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "books", key = "#id")
    public BookDTO getBookById(Long id) throws BookNotFoundException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        return modelMapper.map(book, BookDTO.class);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "books", key = "'deletedBooks'")
    public List<BookDTO> getDeletedBooks() {
        return bookRepository.findAll().stream()
                .filter(Book::getIsDeleted)
                .map(book -> modelMapper.map(book, BookDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public int getStockQuantity(Long id) throws BookNotFoundException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return book.getStockQuantity();
    }

    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public void addBook(BookDTO bookDTO) {
        Book book = modelMapper.map(bookDTO, Book.class);
        book.setIsDeleted(false);
        bookRepository.save(book);
    }

    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public void updateBook(Long id, BookDTO bookDTO) throws BookNotFoundException {
        try {
            Book existingBook = bookRepository.findById(id)
                    .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));

            modelMapper.map(bookDTO, existingBook); // Use ModelMapper to copy properties

            bookRepository.save(existingBook);
        } catch (OptimisticLockingFailureException e) {
            throw new BookNotFoundException("Conflict occurred while updating book with id: " + id);
        }
    }

    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public void deleteBook(Long id) throws BookNotFoundException {
        try {
            Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
            book.setIsDeleted(true);
            bookRepository.save(book);
        } catch (OptimisticLockingFailureException e) {
            throw new BookNotFoundException("Conflict occurred while deleting book with id: " + id);
        }
    }

    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public void restoreBook(Long id) throws BookNotFoundException {
        try {
            Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
            book.setIsDeleted(false);
            bookRepository.save(book);
        } catch (OptimisticLockingFailureException e) {
            throw new BookNotFoundException("Conflict occurred while restoring book with id: " + id);
        }
    }

    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public void decreaseStockQuantity(Long id) {
        try {
            Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

            if (book.getStockQuantity() > 0) {
                book.setStockQuantity(book.getStockQuantity() - 1);
                bookRepository.save(book);
            } else {
                throw new IllegalArgumentException("Stock quantity cannot be less than zero");
            }
        } catch (OptimisticLockingFailureException e) {
            throw new ResourceNotFoundException("Conflict occurred while decreasing stock quantity for book with id: " + id);
        }
    }

    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public void increaseStockQuantity(Long id, int quantity) {
        try {
            Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
            book.setStockQuantity(book.getStockQuantity() + quantity);
            bookRepository.save(book);
        } catch (OptimisticLockingFailureException e) {
            throw new ResourceNotFoundException("Conflict occurred while increasing stock quantity for book with id: " + id);
        }
    }
}
