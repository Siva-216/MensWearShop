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

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.fashionworld.backend.repository.UserRepository userRepository;

    public Order createOrder(Order order) {
        // Implementation logic for calculations or stock checks could be added here
        Order savedOrder = orderRepository.save(order);
        
        // Notify user about order creation
        notifyUser(savedOrder, "Your Order " + savedOrder.getOrderId() + " Placed Successfully!", 
            "Hello,\n\nYour order " + savedOrder.getOrderId() + " has been placed successfully. Thank you for shopping with FashionWorld!");
        
        return savedOrder;
    }

    private void notifyUser(Order order, String subject, String body) {
        userRepository.findById(order.getUserId()).ifPresent(user -> {
            emailService.sendSimpleEmail(user.getEmail(), subject, body);
        });
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
            Order updatedOrder = orderRepository.save(order);

            // Notify user about status update
            notifyUser(updatedOrder, "Order Update: " + updatedOrder.getOrderId(), 
                "Hello,\n\nYour order " + updatedOrder.getOrderId() + " status has been updated to: " + status + ".");
            
            return updatedOrder;
        }
        return null;
    }
}
