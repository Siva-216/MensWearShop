package com.fashionworld.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fashionworld.backend.model.User;
import com.fashionworld.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.fashionworld.backend.service.EmailService emailService;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            java.util.List<User> users = userService.findAll();
            users.forEach(u -> u.setPassword(null));
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching users: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.register(user);
            
            // Send welcome email
            emailService.sendSimpleEmail(registeredUser.getEmail(), "Welcome to FashionWorld!", 
                "Hello " + registeredUser.getName() + ",\n\nWelcome to FashionWorld! We're thrilled to have you as part of our community. Explore our latest collections and enjoy a seamless shopping experience.");
            
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            User loggedInUser = userService.login(user);
            return ResponseEntity.ok(loggedInUser);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials: " + e.getMessage());
        }
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable String id) {
        try {
            // Simplified: Fetch profile by ID
            User user = userService.findById(id).orElseGet(() -> 
                userService.findByEmail(id).orElseThrow(() -> new RuntimeException("User not found"))
            );
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable String id, @RequestBody User updateData) {
        try {
            User updatedUser = userService.updateUser(id, updateData);
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting account: " + e.getMessage());
        }
    }

    @PostMapping("/bulk-email")
    public ResponseEntity<?> sendBulkEmail(@RequestBody java.util.Map<String, String> emailData) {
        try {
            String role = emailData.get("role");
            String subject = emailData.get("subject");
            String message = emailData.get("message");
            
            java.util.List<User> recipients = userService.findAll().stream()
                .filter(u -> role.equalsIgnoreCase("all") || (u.getRole() != null && u.getRole().equalsIgnoreCase(role)))
                .collect(java.util.stream.Collectors.toList());
            
            recipients.forEach(u -> emailService.sendSimpleEmail(u.getEmail(), subject, message));
            
            return ResponseEntity.ok("Successfully sent email to " + recipients.size() + " " + (role.equalsIgnoreCase("all") ? "users" : role + "s") + ".");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending bulk email: " + e.getMessage());
        }
    }
}
