package com.fashionworld.backend.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pos_transactions")
public class PosTransaction {

    @Id
    private String id;
    
    // Unique POS Transaction ID (e.g., POS-12345678)
    private String transactionId; 

    // Staff tracking
    private String staffId;
    private String staffName;
    
    // Customer Info (Direct entry at counter)
    private String customerName;
    private String customerPhone;
    private String customerEmail; // Optional
    
    // Items sold
    private List<OrderItem> items;
    
    // Financial Details
    private double subTotal;
    private double tax;
    private double discount;
    private double totalAmount;
    
    // Cash Management
    private String paymentMethod; // Cash, Card, UPI, etc.
    private double cashReceived; // For cash payments
    private double balanceReturned; // Change given back to customer
    
    private String status; // Usually "Completed" or "Refunded"
    
    @CreatedDate
    private Date createdAt;
}
