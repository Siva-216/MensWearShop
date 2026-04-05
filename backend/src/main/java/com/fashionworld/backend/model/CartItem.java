package com.fashionworld.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    private String productId;
    
    private String name;
    
    private double price;
    
    private int quantity;
    
    private String image;
    
    private String size;

}
