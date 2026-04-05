package com.fashionworld.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fashionworld.backend.model.User;
import com.fashionworld.backend.model.Wishlist;
import com.fashionworld.backend.security.JwtUtil;
import com.fashionworld.backend.service.UserService;
import com.fashionworld.backend.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserIdFromToken(String token) {
        String jwt = token.substring(7);
        String email = jwtUtil.extractUsername(jwt);
        User user = userService.findByEmail(email).orElseThrow();
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<Wishlist> getMyWishlist(@RequestHeader("Authorization") String token) {
        String userId = getUserIdFromToken(token);
        return ResponseEntity.ok(wishlistService.getWishlistByUserId(userId));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Wishlist> addToWishlist(@PathVariable String productId,
            @RequestHeader("Authorization") String token) {
        String userId = getUserIdFromToken(token);
        return ResponseEntity.ok(wishlistService.addProductToWishlist(userId, productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Wishlist> removeFromWishlist(@PathVariable String productId,
            @RequestHeader("Authorization") String token) {
        String userId = getUserIdFromToken(token);
        return ResponseEntity.ok(wishlistService.removeProductFromWishlist(userId, productId));
    }

    @DeleteMapping
    public ResponseEntity<?> clearWishlist(@RequestHeader("Authorization") String token) {
        String userId = getUserIdFromToken(token);
        wishlistService.clearWishlist(userId);
        return ResponseEntity.ok("Wishlist cleared");
    }
}
