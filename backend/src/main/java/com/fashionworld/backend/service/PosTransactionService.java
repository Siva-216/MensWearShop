package com.fashionworld.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.PosTransaction;
import com.fashionworld.backend.repository.PosTransactionRepository;

@Service
public class PosTransactionService {

    @Autowired
    private com.fashionworld.backend.repository.PosTransactionRepository posRepository;

    @Autowired
    private com.fashionworld.backend.repository.ProductRepository productRepository;

    public PosTransaction saveTransaction(PosTransaction transaction) {
        double subTotal = 0;
        
        // Update product stock and fetch correct prices
        if (transaction.getItems() != null) {
            System.out.println("Processing POS transaction " + transaction.getTransactionId() + " using DB data");
            for (com.fashionworld.backend.model.OrderItem item : transaction.getItems()) {
                Optional<com.fashionworld.backend.model.Product> productOpt = productRepository.findById(item.getId());
                
                if (productOpt.isPresent()) {
                    com.fashionworld.backend.model.Product product = productOpt.get();
                    
                    // Check stock availability
                    if (item.getQuantity() > product.getStock()) {
                        throw new org.springframework.web.server.ResponseStatusException(
                            org.springframework.http.HttpStatus.BAD_REQUEST, 
                            "Only " + product.getStock() + " amount of product available for " + product.getName()
                        );
                    }
                    
                    // Always use backend price and name
                    double currentPrice = product.getDiscountPrice() > 0 ? product.getDiscountPrice() : product.getPrice();
                    item.setPrice(currentPrice);
                    item.setName(product.getName());
                    if (item.getImage() == null || item.getImage().isEmpty()) {
                        item.setImage(product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "");
                    }
                    
                    // Update Stock at Variant Level
                    if (product.getVariants() != null) {
                        for (com.fashionworld.backend.model.ProductVariant variant : product.getVariants()) {
                            boolean isMatch = false;
                            if (item.getSku() != null && !item.getSku().isEmpty() && variant.getSku() != null) {
                                isMatch = item.getSku().equalsIgnoreCase(variant.getSku());
                            } else if (item.getSize() != null && variant.getSize() != null && 
                                       item.getSize().equalsIgnoreCase(variant.getSize())) {
                                if (item.getColor() != null && variant.getColor() != null) {
                                    isMatch = item.getColor().equalsIgnoreCase(variant.getColor());
                                } else if (item.getColor() == null && variant.getColor() == null) {
                                    isMatch = true;
                                }
                            }

                            if (isMatch) {
                                variant.setStock(variant.getStock() - item.getQuantity());
                                break;
                            }
                        }
                    }
                    productRepository.save(product);
                    
                    System.out.println("POS Item: " + product.getName() + " | Price: " + currentPrice + " | SKU: " + item.getSku() + " updated.");
                    
                    subTotal += currentPrice * item.getQuantity();
                } else {
                    System.out.println("WARNING: Product with ID " + item.getId() + " not found!");
                }
            }
        }
        
        // Recalculate totals
        transaction.setSubTotal(subTotal);
        transaction.setTotalAmount(subTotal + transaction.getTax() - transaction.getDiscount());
        
        // Calculate change automatically if cash is Received
        if (transaction.getPaymentMethod() != null && transaction.getPaymentMethod().equalsIgnoreCase("Cash")) {
            transaction.setBalanceReturned(transaction.getCashReceived() - transaction.getTotalAmount());
        }
        
        return posRepository.save(transaction);
    }

    public List<PosTransaction> getAllTransactions() {
        return posRepository.findAll();
    }

    public List<PosTransaction> getTransactionsByStaffId(String staffId) {
        return posRepository.findByStaffId(staffId);
    }

    public Optional<PosTransaction> getTransactionByPosId(String posId) {
        return posRepository.findByTransactionId(posId);
    }
}
