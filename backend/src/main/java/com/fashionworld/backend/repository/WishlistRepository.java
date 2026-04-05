package com.fashionworld.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.fashionworld.backend.model.Wishlist;

@Repository
public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    Optional<Wishlist> findByUserId(String userId);
}
