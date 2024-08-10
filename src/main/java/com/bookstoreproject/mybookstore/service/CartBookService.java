package com.bookstoreproject.mybookstore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartBookService {

    @Autowired
    private CartService cartService;


}