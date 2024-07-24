package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.BookNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.CartNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.EmptyCartException;
import com.bookstoreproject.mybookstore.dto.CartBookDTO;
import com.bookstoreproject.mybookstore.dto.CartBookDTO;
import com.bookstoreproject.mybookstore.dto.CartDTO;
import com.bookstoreproject.mybookstore.entity.Book;
import com.bookstoreproject.mybookstore.entity.Cart;
import com.bookstoreproject.mybookstore.entity.Order;
import com.bookstoreproject.mybookstore.repository.BookRepository;
import com.bookstoreproject.mybookstore.repository.CartRepository;
import com.bookstoreproject.mybookstore.repository.OrderRepository;
import com.bookstoreproject.mybookstore.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private OrderRepository orderRepository;

    private BookService bookService;

    @Autowired
    private ModelMapper modelMapper;

    public CartService(BookService bookService) {
        this.bookService = bookService;
    }

    @Transactional
    public void addBookToCart(Long cartId, Long bookId) throws CartNotFoundException, BookNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));

        int stockQuantity = bookService.getStockQuantity(bookId);
        if (stockQuantity > 0) {
            // Add the book to the cart
            cart.getBooks().add(book);
            cartRepository.save(cart);
            // Decrease the stock quantity by one
            bookService.decreaseStockQuantity(bookId);
        } else {
            throw new IllegalArgumentException("Book is out of stock");
        }
    }

    @Transactional
    public void removeBookFromCart(Long cartId, Long bookId) throws CartNotFoundException, BookNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));

        // Check if the book is in the cart
        if (cart.getBooks().contains(book)) {
            // Remove the book from the cart

            cart.getBooks().remove(book);
            cartRepository.save(cart);
            // Increase the stock quantity by one
            bookService.increaseStockQuantity(bookId);
        } else {
            throw new IllegalArgumentException("Book is not in the cart");
        }
    }


    @Transactional
    public void submitCart(Long cartId) throws CartNotFoundException, EmptyCartException {

        // Retrieve the cart by its ID
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));

        // Check if the cart is empty
        if (cart.getBooks().isEmpty()) {
            throw new EmptyCartException("Cannot submit an empty cart");
        }

        // Create a new Order
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setBooks(new ArrayList<>(cart.getBooks()));
        order.setStatus(Order.OrderStatus.INPROCESS);

        // Calculate the total price of the order
        BigDecimal totalPrice = cart.getBooks().stream()
                .map(Book::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalPrice(totalPrice);

        // Save the order
        orderRepository.save(order);

        // Clear the cart's books and update the cart
        cart.getBooks().clear();
        cartRepository.save(cart);
    }


    public BigDecimal sumAllCartProducts(Long cartId) throws CartNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));
        return cart.getBooks().stream()
                .map(Book::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional
    public CartDTO getCartById(Long id) throws CartNotFoundException {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + id));

        // Map books to a temporary list with their quantities
        Map<Long, Integer> bookQuantityMap = new HashMap<>();
        for (Book book : cart.getBooks()) {
            bookQuantityMap.merge(book.getId(), 1, Integer::sum);  // Increment the quantity for each book
        }

        // Convert the map to a list of CartBookDTO
        List<CartBookDTO> cartBooks = bookQuantityMap.entrySet().stream()
                .map(entry -> new CartBookDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        // Map Cart to CartDTO manually
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartID(cart.getId());
        cartDTO.setDateCreated(cart.getDateCreated());
        cartDTO.setUserId(cart.getUser().getId());
        cartDTO.setCartBooks(cartBooks);

        return cartDTO;
    }


}
