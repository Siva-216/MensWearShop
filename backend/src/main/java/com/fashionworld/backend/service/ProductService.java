package com.fashionworld.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.Product;
import com.fashionworld.backend.model.ProductVariant;
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
        validateVariants(product);
        return productRepository.save(product);
    }

    private void validateVariants(Product product) {
        if (product.getVariants() == null || product.getVariants().isEmpty()) {
            return;
        }

        // Check for duplicate size + color within this product
        java.util.Set<String> combinations = new java.util.HashSet<>();
        java.util.Set<String> skus = new java.util.HashSet<>();

        for (ProductVariant variant : product.getVariants()) {
            String combo = (variant.getSize() + "-" + variant.getColor()).toLowerCase();
            if (!combinations.add(combo)) {
                throw new RuntimeException("Duplicate variant combination: " + variant.getSize() + " (" + variant.getColor() + ")");
            }
            if (variant.getSku() != null && !variant.getSku().isEmpty()) {
                if (!skus.add(variant.getSku())) {
                    throw new RuntimeException("Duplicate SKU in product variants: " + variant.getSku());
                }
            }
        }
    }

    public Product updateProduct(String id, Product productData) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (productData.getName() != null) product.setName(productData.getName());
        if (productData.getDescription() != null) product.setDescription(productData.getDescription());
        if (productData.getBrand() != null) product.setBrand(productData.getBrand());
        if (productData.getBasePrice() > 0) product.setBasePrice(productData.getBasePrice());
        if (productData.getDiscountPrice() > 0) product.setDiscountPrice(productData.getDiscountPrice());
        if (productData.getCategoryId() != null) product.setCategoryId(productData.getCategoryId());
        if (productData.getCategoryName() != null) product.setCategoryName(productData.getCategoryName());
        if (productData.getImages() != null) product.setImages(productData.getImages());
        if (productData.getSizeSystem() != null) product.setSizeSystem(productData.getSizeSystem());
        if (productData.getGender() != null) product.setGender(productData.getGender());
        
        product.setNew(productData.isNew());
        product.setSale(productData.isSale());
        if (productData.getTags() != null) product.setTags(productData.getTags());
        if (productData.getAttributes() != null) product.setAttributes(productData.getAttributes());

        if (productData.getVariants() != null) {
            product.setVariants(productData.getVariants());
        }

        validateVariants(product);
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
