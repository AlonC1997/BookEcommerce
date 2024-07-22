package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.BookNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.CartNotFoundException;
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

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public void addBookToCart(Long cartId, Long bookId) throws CartNotFoundException, BookNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));

        // Add the book to the cart (assuming one-to-many or many-to-many relationship)
        cart.getBooks().add(book);
        cartRepository.save(cart);
    }

    @Transactional
    public void removeBookFromCart(Long cartId, Long bookId) throws CartNotFoundException, BookNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));

        // Remove the book from the cart (assuming one-to-many or many-to-many relationship)
        cart.getBooks().remove(book);
        cartRepository.save(cart);
    }

    /*

    @Transactional
    public void addOneBookToCart(Long cartId, Long bookId) throws CartNotFoundException, BookNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));
        cart.getBooks().add(book);
        cartRepository.save(cart);
    }

    @Transactional
    public void removeOneBookFromCart(Long cartId, Long bookId) throws CartNotFoundException, BookNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));
        cart.getBooks().remove(book);
        cartRepository.save(cart);
    }

     */

    @Transactional
    public void submitCart(Long cartId) throws CartNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));

        Order order = new Order();
        order.setBooks(cart.getBooks());
        order.setUser(cart.getUser());
        order.setStatus(Order.OrderStatus.INPROCESS);
        order.setTotalPrice(sumAllCartProducts(cartId));

        orderRepository.save(order);

        cart.getBooks().clear();
        cartRepository.save(cart);
    }

    @Transactional(readOnly = true)
    public BigDecimal sumAllCartProducts(Long cartId) throws CartNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));
        return cart.getBooks().stream()
                .map(Book::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional(readOnly = true)
    public CartDTO getCartById(Long id) throws CartNotFoundException {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + id));
        return modelMapper.map(cart, CartDTO.class);
    }
}
