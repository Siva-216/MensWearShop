package com.fashionworld.backend.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    private String id; // Matches frontend UserAddress id
    private String name; // Receiver's name
    private List<String> addressLines;
    private String city;
    private String state;
    private String zip;
    private String country;
    private String phone;
    private String altPhone;
    private String label; // e.g., "Home", "Office"
    private Boolean isDefault;

}
