package com.fashionworld.backend.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String name;
    private String description;
    private String brand;
    private double price;
    private double discountPrice;

    private String categoryId;
    private String categoryName;
    
    private List<String> images;
    private List<String> sizes;
    private List<String> colors;

    private int stock;
    private double rating;
    private int numReviews;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;
}
