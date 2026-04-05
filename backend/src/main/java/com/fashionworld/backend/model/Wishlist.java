package com.fashionworld.backend.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "wishlists")
public class Wishlist {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private List<String> productIds = new ArrayList<>();

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;
}
