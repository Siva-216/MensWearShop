package com.fashionworld.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.fashionworld.backend.model.Product;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategoryId(String categoryId);
    List<Product> findByBrand(String brand);
}
