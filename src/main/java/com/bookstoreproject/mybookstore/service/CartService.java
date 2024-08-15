package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.BookNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.CartNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.EmptyCartException;
import com.bookstoreproject.mybookstore.Exceptions.OrderNotFoundException;
import com.bookstoreproject.mybookstore.dto.CartBookDTO;
import com.bookstoreproject.mybookstore.dto.CartDTO;
import com.bookstoreproject.mybookstore.entity.Book;
import com.bookstoreproject.mybookstore.entity.Cart;
import com.bookstoreproject.mybookstore.entity.Order;
import com.bookstoreproject.mybookstore.repository.BookRepository;
import com.bookstoreproject.mybookstore.repository.CartRepository;
import com.bookstoreproject.mybookstore.repository.OrderRepository;
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

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final BookService bookService;
    private final OrderService orderService;

    @Autowired
    public CartService(CartRepository cartRepository,
                       BookRepository bookRepository,
                       OrderRepository orderRepository,
                       BookService bookService,
                       OrderService orderService) {
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
        this.orderRepository = orderRepository;
        this.bookService = bookService;
        this.orderService = orderService;
    }

    @Transactional
    public void addBookToCart(Long cartId, Long bookId) throws CartNotFoundException, BookNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));

        int stockQuantity = bookService.getStockQuantity(bookId);
        if (stockQuantity > 0) {
            cart.getBooks().add(book);
            cartRepository.save(cart);
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

        if (cart.getBooks().contains(book)) {
            cart.getBooks().remove(book);
            cartRepository.save(cart);
            bookService.increaseStockQuantity(bookId, 1);
        } else {
            throw new IllegalArgumentException("Book is not in the cart");
        }
    }

    @Transactional
    public void submitCart(Long cartId) throws CartNotFoundException, EmptyCartException, OrderNotFoundException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found with id: " + cartId));

        if (cart.getBooks().isEmpty()) {
            throw new EmptyCartException("Cannot submit an empty cart");
        }

        long userId = cart.getUser().getId();
        System.out.println("User ID: " + userId);

        BigDecimal totalPrice = cart.getBooks().stream()
                .map(Book::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        boolean isFirstOrder = orderService.getLastOrderIdForUser(userId) == 0;
        System.out.println("Is first order: " + isFirstOrder);

        BigDecimal discountedPrice = isFirstOrder ? totalPrice.multiply(BigDecimal.valueOf(0.95)) : totalPrice;
        System.out.println("Total Price: " + totalPrice);
        System.out.println("Discounted Price: " + discountedPrice);

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setBooks(new ArrayList<>(cart.getBooks()));
        order.setStatus(Order.OrderStatus.INPROCESS);
        order.setTotalPrice(discountedPrice);

        orderRepository.save(order);

        cart.getBooks().clear();
        cartRepository.save(cart);

        System.out.println("Order submitted successfully. Order ID: " + order.getId());
    }


    @Transactional
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

        Map<Long, Integer> bookQuantityMap = new HashMap<>();
        for (Book book : cart.getBooks()) {
            bookQuantityMap.merge(book.getId(), 1, Integer::sum);
        }

        List<CartBookDTO> cartBooks = bookQuantityMap.entrySet().stream()
                .map(entry -> {
                    Book book = cart.getBooks().stream()
                            .filter(b -> b.getId().equals(entry.getKey()))
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("Book not found with id: " + entry.getKey()));
                    return new CartBookDTO(book.getId(), book.getName(), book.getPrice(), entry.getValue());
                })
                .collect(Collectors.toList());

        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartID(cart.getId());
        cartDTO.setDateCreated(cart.getCreatedAt());
        cartDTO.setUserId(cart.getUser().getId());
        cartDTO.setCartBooks(cartBooks);

        return cartDTO;
    }

    @Transactional
    public List<CartBookDTO> getCartBooksByCartId(Long cartId) throws CartNotFoundException {
        CartDTO cartDTO = this.getCartById(cartId);
        return cartDTO.getCartBooks();
    }

}
