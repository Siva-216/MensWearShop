package com.fashionworld.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.Review;
import com.fashionworld.backend.repository.OrderRepository;
import com.fashionworld.backend.repository.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Review createReview(Review review) {
        // Step 1: Find all orders for this user
        List<com.fashionworld.backend.model.Order> userOrders = orderRepository.findByUserId(review.getUserId());
        
        // Step 2: Check if any order is "Delivered" and contains the productId
        boolean hasPurchasedAndReceived = userOrders.stream()
                .filter(order -> "Delivered".equalsIgnoreCase(order.getStatus()))
                .anyMatch(order -> order.getItems().stream()
                        .anyMatch(item -> item.getId().equals(review.getProductId())));

        if (hasPurchasedAndReceived) {
            return reviewRepository.save(review);
        } else {
            // Throwing a runtime exception for simplicity; in a real app, use a custom Exception
            throw new RuntimeException("You can only review products that have been delivered to you.");
        }
    }

    public List<Review> getReviewsByProductId(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    public List<Review> getReviewsByUserId(String userId) {
        return reviewRepository.findByUserId(userId);
    }

    public Optional<Review> getReviewById(String id) {
        return reviewRepository.findById(id);
    }

    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }

    public Review updateReview(String id, Review updatedReview) {
        Optional<Review> existingReview = reviewRepository.findById(id);
        if (existingReview.isPresent()) {
            Review review = existingReview.get();
            review.setRating(updatedReview.getRating());
            review.setComment(updatedReview.getComment());
            review.setImages(updatedReview.getImages());
            return reviewRepository.save(review);
        }
        return null;
    }
}
