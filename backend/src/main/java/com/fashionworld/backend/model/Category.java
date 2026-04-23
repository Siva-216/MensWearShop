package com.fashionworld.backend.model;

import java.util.Date;

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
@Document(collection = "categories")
public class Category {

    @Id
    private String id;

    private String name;
    private String slug;
    private String description;
    private java.util.List<String> images;
    private String parentId; // For hierarchy (null for top-level)
    private int priority; // For sorting categories on UI

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;
}
