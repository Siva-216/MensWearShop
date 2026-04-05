package com.fashionworld.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.Order;
import com.fashionworld.backend.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        // Implementation logic for calculations or stock checks could be added here
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public Optional<Order> getOrderByOrderId(String orderId) {
        return orderRepository.findByOrderId(orderId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(String id, String status, int trackingStep) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setStatus(status);
            order.setTrackingStep(trackingStep);
            return orderRepository.save(order);
        }
        return null;
    }
}
