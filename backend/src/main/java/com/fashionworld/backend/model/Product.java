package com.fashionworld.backend.model;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Objects;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Product {

    @Id
    private String id;

    private String name;
    private String description;
    private String brand;

    @Field("price")
    private double basePrice;

    private double discountPrice;

    private String categoryId;
    private String categoryName;
    
    private List<String> images;
    private List<ProductVariant> variants; 

    private String sizeSystem; // e.g., ALPHA, NUMERIC_WAIST, etc.
    private String gender;     // e.g., "Men", "Women"

    private boolean isNew;
    private boolean isSale;
    private List<String> tags;
    private Map<String, String> attributes; // For fabric, fit, etc.

    private double rating;
    private int numReviews;
    private int salesCount;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;

    @Transient
    @JsonProperty("stock")
    public int getStock() {
        if (variants == null || variants.isEmpty()) return 0;
        return variants.stream()
                .filter(Objects::nonNull)
                .mapToInt(ProductVariant::getStock)
                .sum();
    }

    @Transient
    @JsonProperty("price")
    public double getPrice() {
        return basePrice;
    }

    @Transient
    @JsonProperty("sizes")
    public Set<String> getSizes() {
        if (variants == null) return Set.of();
        return variants.stream()
                .filter(Objects::nonNull)
                .map(ProductVariant::getSize)
                .filter(s -> s != null && !s.isEmpty())
                .collect(Collectors.toSet());
    }

    @Transient
    @JsonProperty("colors")
    public Set<String> getColors() {
        if (variants == null) return Set.of();
        return variants.stream()
                .filter(Objects::nonNull)
                .map(ProductVariant::getColor)
                .filter(c -> c != null && !c.isEmpty())
                .collect(Collectors.toSet());
    }

    @Transient
    @JsonProperty("availableVariants")
    public List<ProductVariant> getAvailableVariants() {
        if (variants == null) return List.of();
        return variants.stream()
                .filter(v -> v != null && v.getStock() > 0)
                .collect(Collectors.toList());
    }

    @Transient
    @JsonProperty("isInStock")
    public boolean isInStock() {
        return getStock() > 0;
    }
}
