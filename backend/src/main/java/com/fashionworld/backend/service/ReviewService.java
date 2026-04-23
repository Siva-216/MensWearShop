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

    @Autowired
    private ProductService productService;

    public Review createReview(Review review) {
        // Step 1: Find the specific order if orderId is provided, or check any delivered order for this product
        boolean hasPurchasedAndReceived = false;
        
        if (review.getOrderId() != null && !review.getOrderId().isEmpty()) {
            Optional<com.fashionworld.backend.model.Order> orderOpt = orderRepository.findById(review.getOrderId());
            if (orderOpt.isPresent()) {
                com.fashionworld.backend.model.Order order = orderOpt.get();
                if ("Delivered".equalsIgnoreCase(order.getStatus())) {
                    hasPurchasedAndReceived = order.getItems().stream()
                            .anyMatch(item -> item.getId().equals(review.getProductId()));
                }
            }
        } else {
            // Fallback to checking any delivered order for this user and product
            List<com.fashionworld.backend.model.Order> userOrders = orderRepository.findByUserId(review.getUserId());
            hasPurchasedAndReceived = userOrders.stream()
                    .filter(order -> "Delivered".equalsIgnoreCase(order.getStatus()))
                    .anyMatch(order -> order.getItems().stream()
                            .anyMatch(item -> item.getId().equals(review.getProductId())));
        }

        if (hasPurchasedAndReceived) {
            Review savedReview = reviewRepository.save(review);
            // Update product rating
            productService.updateProductRating(review.getProductId(), review.getRating(), true);
            return savedReview;
        } else {
            throw new RuntimeException("You can only review products that have been delivered to you.");
        }
    }

    public List<Review> getReviewsByProductId(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    public List<Review> getReviewsByUserId(String userId) {
        return reviewRepository.findByUserId(userId);
    }

    public List<Review> getReviewsByOrderId(String orderId) {
        return reviewRepository.findByOrderId(orderId);
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
