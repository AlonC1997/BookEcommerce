package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.CartNotFoundException;
import com.bookstoreproject.mybookstore.dto.CartBookDTO;
import com.bookstoreproject.mybookstore.dto.CartDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartBookService {

    @Autowired
    private CartService cartService;


}