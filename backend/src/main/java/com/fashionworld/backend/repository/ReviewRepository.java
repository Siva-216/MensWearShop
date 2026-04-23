package com.fashionworld.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.fashionworld.backend.model.Review;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    // Fetch all reviews for a specific product
    List<Review> findByProductId(String productId);

    // Fetch all reviews written by a specific user
    List<Review> findByUserId(String userId);

    // Fetch all reviews for a specific order
    List<Review> findByOrderId(String orderId);

}
