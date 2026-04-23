package com.fashionworld.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.Order;
import com.fashionworld.backend.model.Product;
import com.fashionworld.backend.model.ProductVariant;
import com.fashionworld.backend.repository.OrderRepository;
import com.fashionworld.backend.repository.ProductRepository;
import com.fashionworld.backend.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.fashionworld.backend.repository.UserRepository userRepository;

    @Autowired
    private com.fashionworld.backend.repository.ProductRepository productRepository;

    public Order createOrder(Order order) {
        double subTotal = 0;
        
        // Update product stock and fetch correct prices/details from DB
        if (order.getItems() != null) {
            System.out.println("Processing order " + order.getOrderId() + " with " + order.getItems().size() + " items using DB data");
            for (com.fashionworld.backend.model.OrderItem item : order.getItems()) {
                Optional<com.fashionworld.backend.model.Product> productOpt = productRepository.findById(item.getId());
                
                if (productOpt.isPresent()) {
                    com.fashionworld.backend.model.Product product = productOpt.get();
                    
                    // Check stock availability
                    if (item.getQuantity() > product.getStock()) {
                        throw new org.springframework.web.server.ResponseStatusException(
                            org.springframework.http.HttpStatus.BAD_REQUEST, 
                            "Only " + product.getStock() + " amount of product available for " + product.getName()
                        );
                    }
                    
                    // Always use backend price and name to prevent frontend manipulation
                    double currentPrice = product.getDiscountPrice() > 0 ? product.getDiscountPrice() : product.getPrice();
                    item.setPrice(currentPrice);
                    item.setName(product.getName());
                    if (item.getImage() == null || item.getImage().isEmpty()) {
                        item.setImage(product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "");
                    }
                    
                    // Update Stock at Variant Level
                    if (product.getVariants() != null) {
                        for (ProductVariant variant : product.getVariants()) {
                            boolean isMatch = false;
                            if (item.getSku() != null && !item.getSku().isEmpty() && variant.getSku() != null) {
                                isMatch = item.getSku().equalsIgnoreCase(variant.getSku());
                            } else if (item.getSize() != null && variant.getSize() != null && 
                                       item.getSize().equalsIgnoreCase(variant.getSize())) {
                                // Fallback to size + color match if SKU is not provided or matched
                                if (item.getColor() != null && variant.getColor() != null) {
                                    isMatch = item.getColor().equalsIgnoreCase(variant.getColor());
                                } else if (item.getColor() == null && variant.getColor() == null) {
                                    isMatch = true;
                                }
                            }

                            if (isMatch) {
                                variant.setStock(variant.getStock() - item.getQuantity());
                                break;
                            }
                        }
                    }
                    productRepository.save(product);
                    
                    System.out.println("Item: " + product.getName() + " | Price: " + currentPrice + " | SKU: " + item.getSku() + " updated in local variants.");
                    
                    subTotal += currentPrice * item.getQuantity();
                } else {
                    System.out.println("WARNING: Product with ID " + item.getId() + " not found!");
                }
            }
        }
        
        // Recalculate totals from backend data
        if (order.isOffline()) {
             order.setSubTotal(subTotal);
             order.setTotalAmount(subTotal + order.getTax() - order.getDiscount());
        } else {
             order.setTotalAmount(subTotal);
        }

        // Initialize status history
        java.util.List<com.fashionworld.backend.model.StatusUpdate> history = new java.util.ArrayList<>();
        history.add(new com.fashionworld.backend.model.StatusUpdate("Order Placed", new java.util.Date()));
        order.setStatusHistory(history);
        if (order.getStatus() == null) {
            order.setStatus("Order Placed");
        }
        if (order.getTrackingStep() == 0) {
            order.setTrackingStep(1);
        }

        Order savedOrder = orderRepository.save(order);
        
        // Notify user about order creation
        notifyUser(savedOrder, "Your Order " + savedOrder.getOrderId() + " Placed Successfully!", 
            "Hello,\n\nYour order " + savedOrder.getOrderId() + " has been placed successfully. Thank you for shopping with FashionWorld!");
        
        return savedOrder;
    }

    private void notifyUser(Order order, String subject, String body) {
        if (order.getUserId() != null) {
            userRepository.findById(order.getUserId()).ifPresent(user -> {
                emailService.sendSimpleEmail(user.getEmail(), subject, body);
            });
        } else if (order.getCustomerEmail() != null && !order.getCustomerEmail().isEmpty()) {
            // For offline orders without a registered user account
            emailService.sendSimpleEmail(order.getCustomerEmail(), subject, body);
        }
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByStaffId(String staffId) {
        return orderRepository.findByStaffId(staffId);
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
            String oldStatus = order.getStatus();
            order.setStatus(status);
            order.setTrackingStep(trackingStep);
            
            // Return stock if cancelled
            if (status.equalsIgnoreCase("CANCELLED") && !oldStatus.equalsIgnoreCase("CANCELLED")) {
                if (order.getItems() != null) {
                    for (com.fashionworld.backend.model.OrderItem item : order.getItems()) {
                        productRepository.findById(item.getId()).ifPresent(product -> {
                            // Return stock to variant
                            if (product.getVariants() != null) {
                                for (ProductVariant variant : product.getVariants()) {
                                    boolean isMatch = false;
                                    if (item.getSku() != null && !item.getSku().isEmpty() && variant.getSku() != null) {
                                        isMatch = item.getSku().equalsIgnoreCase(variant.getSku());
                                    } else if (item.getSize() != null && variant.getSize() != null && 
                                               item.getSize().equalsIgnoreCase(variant.getSize())) {
                                        if (item.getColor() != null && variant.getColor() != null) {
                                            isMatch = item.getColor().equalsIgnoreCase(variant.getColor());
                                        } else if (item.getColor() == null && variant.getColor() == null) {
                                            isMatch = true;
                                        }
                                    }
                                    
                                    if (isMatch) {
                                        variant.setStock(variant.getStock() + item.getQuantity());
                                        break;
                                    }
                                }
                            }
                            productRepository.save(product);
                        });
                    }
                }
            }
            
            // Append to status history
            if (order.getStatusHistory() == null) {
                order.setStatusHistory(new java.util.ArrayList<>());
            }
            order.getStatusHistory().add(new com.fashionworld.backend.model.StatusUpdate(status, new java.util.Date()));

            Order updatedOrder = orderRepository.save(order);

            // Notify user about status update
            notifyUser(updatedOrder, "Order Update: " + updatedOrder.getOrderId(), 
                "Hello,\n\nYour order " + updatedOrder.getOrderId() + " status has been updated to: " + status + ".");
            
            return updatedOrder;
        }
        return null;
    }
}
