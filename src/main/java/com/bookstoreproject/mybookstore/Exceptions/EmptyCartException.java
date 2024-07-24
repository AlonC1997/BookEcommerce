package com.bookstoreproject.mybookstore.Exceptions;

public class EmptyCartException extends RuntimeException {
    public EmptyCartException(String message) {
        super(message);
    }
}