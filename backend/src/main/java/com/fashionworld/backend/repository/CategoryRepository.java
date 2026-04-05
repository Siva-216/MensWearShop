package com.fashionworld.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.fashionworld.backend.model.Category;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByParentId(String parentId);
}
