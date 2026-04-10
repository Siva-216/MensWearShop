package com.fashionworld.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fashionworld.backend.model.PosTransaction;
import com.fashionworld.backend.service.PosTransactionService;

@RestController
@RequestMapping("/api/pos")
@CrossOrigin(origins = "*")
public class PosTransactionController {

    @Autowired
    private PosTransactionService posService;

    @PostMapping
    public ResponseEntity<PosTransaction> createTransaction(@RequestBody PosTransaction transaction) {
        PosTransaction saved = posService.saveTransaction(transaction);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PosTransaction>> getAllTransactions() {
        return new ResponseEntity<>(posService.getAllTransactions(), HttpStatus.OK);
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<PosTransaction>> getByStaff(@PathVariable String staffId) {
        return new ResponseEntity<>(posService.getTransactionsByStaffId(staffId), HttpStatus.OK);
    }

    @GetMapping("/{posId}")
    public ResponseEntity<PosTransaction> getByPosId(@PathVariable String posId) {
        Optional<PosTransaction> transaction = posService.getTransactionByPosId(posId);
        return transaction.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
