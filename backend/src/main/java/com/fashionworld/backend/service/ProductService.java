package com.fashionworld.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.Product;
import com.fashionworld.backend.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(String categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product productData) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (productData.getName() != null) product.setName(productData.getName());
        if (productData.getDescription() != null) product.setDescription(productData.getDescription());
        if (productData.getBrand() != null) product.setBrand(productData.getBrand());
        if (productData.getPrice() > 0) product.setPrice(productData.getPrice());
        if (productData.getDiscountPrice() > 0) product.setDiscountPrice(productData.getDiscountPrice());
        if (productData.getCategoryId() != null) product.setCategoryId(productData.getCategoryId());
        if (productData.getCategoryName() != null) product.setCategoryName(productData.getCategoryName());
        if (productData.getImages() != null) product.setImages(productData.getImages());
        if (productData.getSizes() != null) product.setSizes(productData.getSizes());
        if (productData.getColors() != null) product.setColors(productData.getColors());
        if (productData.getStock() >= 0) product.setStock(productData.getStock());

        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
