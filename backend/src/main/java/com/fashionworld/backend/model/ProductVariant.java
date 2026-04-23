package com.fashionworld.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {
    private String sku;      // Unique identifier
    private String size;     // e.g., "S", "M", "32", "34"
    private String color;    // e.g., "Red", "Blue"
    private int stock;       // Inventory count
    private Double price;    // Optional price override
}
