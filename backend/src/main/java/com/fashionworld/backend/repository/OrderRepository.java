package com.fashionworld.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.fashionworld.backend.model.Order;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    // Fetch all orders for a specific user ID
    List<Order> findByUserId(String userId);

    // Fetch a single order by its user-facing orderId string (e.g., ORD-XXXXXXXX)
    Optional<Order> findByOrderId(String orderId);

    // Fetch all offline orders processed by a specific staff member
    List<Order> findByStaffId(String staffId);

}
