package com.fashionworld.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.fashionworld.backend.model.Cart;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {

    // Find cart by user ID
    Optional<Cart> findByUserId(String userId);

}
