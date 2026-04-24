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
        String debugInfo = "Order: " + review.getOrderId() + ", Product: " + review.getProductId() + ", User: " + review.getUserId();
        
        if (review.getOrderId() != null && !review.getOrderId().isEmpty()) {
            Optional<com.fashionworld.backend.model.Order> orderOpt = orderRepository.findById(review.getOrderId());
            if (!orderOpt.isPresent()) {
                orderOpt = orderRepository.findByOrderId(review.getOrderId());
                debugInfo += " (Found by findByOrderId: " + orderOpt.isPresent() + ")";
            } else {
                debugInfo += " (Found by findById)";
            }

            if (orderOpt.isPresent()) {
                com.fashionworld.backend.model.Order order = orderOpt.get();
                String status = order.getStatus();
                debugInfo += ", Status: " + status;
                if ("Delivered".equalsIgnoreCase(status) || "Completed".equalsIgnoreCase(status)) {
                    hasPurchasedAndReceived = order.getItems().stream()
                            .anyMatch(item -> item.getId().equals(review.getProductId()));
                    debugInfo += ", HasMatch: " + hasPurchasedAndReceived;
                }
            }
        } else {
            List<com.fashionworld.backend.model.Order> userOrders = orderRepository.findByUserId(review.getUserId());
            debugInfo += ", UserOrdersCount: " + userOrders.size();
            hasPurchasedAndReceived = userOrders.stream()
                    .filter(order -> "Delivered".equalsIgnoreCase(order.getStatus()) || "Completed".equalsIgnoreCase(order.getStatus()))
                    .anyMatch(order -> order.getItems().stream()
                            .anyMatch(item -> item.getId().equals(review.getProductId())));
            debugInfo += ", FallbackHasMatch: " + hasPurchasedAndReceived;
        }

        if (hasPurchasedAndReceived) {
            Review savedReview = reviewRepository.save(review);
            if (review.getRating() != null) {
                productService.updateProductRating(review.getProductId(), review.getRating(), true);
            }
            return savedReview;
        } else {
            throw new RuntimeException("You can only review products that have been delivered to you. Debug: " + debugInfo);
        }
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
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
        Optional<Review> review = reviewRepository.findById(id);
        if (review.isPresent()) {
            String productId = review.get().getProductId();
            reviewRepository.deleteById(id);
            productService.recalculateProductRating(productId);
        }
    }

    public Review updateReview(String id, Review updatedReview) {
        Optional<Review> existingReview = reviewRepository.findById(id);
        if (existingReview.isPresent()) {
            Review review = existingReview.get();
            review.setRating(updatedReview.getRating());
            review.setComment(updatedReview.getComment());
            review.setImages(updatedReview.getImages());
            review.setStatus(updatedReview.getStatus());
            Review saved = reviewRepository.save(review);
            productService.recalculateProductRating(review.getProductId());
            return saved;
        }
        return null;
    }
}
