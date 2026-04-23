package com.fashionworld.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.Category;
import com.fashionworld.backend.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getSubCategories(String parentId) {
        return categoryRepository.findByParentId(parentId);
    }

    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(String id, Category categoryData) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        if (categoryData.getName() != null) category.setName(categoryData.getName());
        if (categoryData.getSlug() != null) category.setSlug(categoryData.getSlug());
        if (categoryData.getDescription() != null) category.setDescription(categoryData.getDescription());
        if (categoryData.getImages() != null) category.setImages(categoryData.getImages());
        if (categoryData.getPriority() >= 0) category.setPriority(categoryData.getPriority());
        category.setParentId(categoryData.getParentId()); // Allow null to make it a top-level category

        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }
}
