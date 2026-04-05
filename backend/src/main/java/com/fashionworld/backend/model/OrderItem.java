package com.fashionworld.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    private String id; // Product ID 

    private String name;
    
    private double price;
    
    private int quantity;
    
    private String image;
    
    // Optional (some products may not have size)
    private String size;

}
