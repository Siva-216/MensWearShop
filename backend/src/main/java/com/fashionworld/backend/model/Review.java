package com.fashionworld.backend.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;
    
    private String productId;
    
    private String userId;
    
    private String userName;
    
    private int rating; // 1 to 5
    
    private String comment;
    
    private List<String> images; // Optional: images uploaded by the reviewer
    
    @CreatedDate
    private Date createdAt;

}
