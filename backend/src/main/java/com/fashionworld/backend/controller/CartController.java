package com.fashionworld.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fashionworld.backend.model.Cart;
import com.fashionworld.backend.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable String userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Cart> updateCart(@PathVariable String userId, @RequestBody Cart updatedCart) {
        Cart cart = cartService.updateCart(userId, updatedCart);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
