package com.fashionworld.backend.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.Wishlist;
import com.fashionworld.backend.repository.WishlistRepository;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    public Wishlist getWishlistByUserId(String userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Wishlist newWishlist = new Wishlist();
                    newWishlist.setUserId(userId);
                    newWishlist.setProductIds(new ArrayList<>());
                    return wishlistRepository.save(newWishlist);
                });
    }

    public Wishlist addProductToWishlist(String userId, String productId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        if (!wishlist.getProductIds().contains(productId)) {
            wishlist.getProductIds().add(productId);
        }
        return wishlistRepository.save(wishlist);
    }

    public Wishlist removeProductFromWishlist(String userId, String productId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        wishlist.getProductIds().remove(productId);
        return wishlistRepository.save(wishlist);
    }

    public void clearWishlist(String userId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        wishlist.getProductIds().clear();
        wishlistRepository.save(wishlist);
    }
}
