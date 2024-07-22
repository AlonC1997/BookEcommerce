package com.bookstoreproject.mybookstore.Exceptions;


public class OutOfStockException extends RuntimeException {
    public OutOfStockException(String message) {
        super(message);
    }
}