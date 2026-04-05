package com.fashionworld.backend.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.Cart;
import com.fashionworld.backend.repository.CartRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public Cart getCartByUserId(String userId) {
        Optional<Cart> cart = cartRepository.findByUserId(userId);
        if (cart.isPresent()) {
            return cart.get();
        } else {
            // Create a new empty cart if it doesn't exist
            Cart newCart = new Cart();
            newCart.setUserId(userId);
            newCart.setItems(new ArrayList<>());
            return cartRepository.save(newCart);
        }
    }

    public Cart updateCart(String userId, Cart updatedCart) {
        Optional<Cart> existingCart = cartRepository.findByUserId(userId);
        Cart cartToSave;
        if (existingCart.isPresent()) {
            cartToSave = existingCart.get();
            cartToSave.setItems(updatedCart.getItems());
        } else {
            cartToSave = updatedCart;
            cartToSave.setUserId(userId);
        }
        return cartRepository.save(cartToSave);
    }

    public void clearCart(String userId) {
        Optional<Cart> cart = cartRepository.findByUserId(userId);
        if (cart.isPresent()) {
            Cart existingCart = cart.get();
            existingCart.getItems().clear();
            cartRepository.save(existingCart);
        }
    }
}
