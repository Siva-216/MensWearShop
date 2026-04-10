package com.fashionworld.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.fashionworld.backend.model.PosTransaction;

@Repository
public interface PosTransactionRepository extends MongoRepository<PosTransaction, String> {
    
    // Fetch all transactions processed by a specific staff member
    List<PosTransaction> findByStaffId(String staffId);
    
    // Find transaction by its specific POS ID (e.g., POS-XXXXXX)
    Optional<PosTransaction> findByTransactionId(String transactionId);
    
    // Search by customer contact
    List<PosTransaction> findByCustomerPhone(String customerPhone);
}
