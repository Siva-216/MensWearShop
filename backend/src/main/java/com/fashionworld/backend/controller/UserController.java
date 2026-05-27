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

    @org.springframework.beans.factory.annotation.Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

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
            emailService.sendWelcomeEmail(registeredUser.getEmail(), registeredUser.getName());
            
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

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            String token = userService.generateResetToken(email);
            
            // Fetch name of the user to personalize the email
            String name = userService.findByEmail(email).map(User::getName).orElse("Valued Customer");
            
            // Reset link pointing to frontend URL
            String resetUrl = frontendUrl + "/reset-password?token=" + token;
            
            emailService.sendForgotPasswordEmail(email, name, resetUrl);
            return ResponseEntity.ok(java.util.Map.of("message", "Password reset link sent to your email."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        try {
            String token = request.get("token");
            String password = request.get("password");
            if (token == null || token.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body("Token and password are required");
            }
            
            userService.resetPassword(token, password);
            return ResponseEntity.ok(java.util.Map.of("message", "Password reset successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
    public ResponseEntity<?> sendBulkEmail(@RequestBody java.util.Map<String, Object> emailData) {
        try {
            String role = String.valueOf(emailData.get("role"));
            String subject = String.valueOf(emailData.get("subject"));
            String message = String.valueOf(emailData.get("message"));
            
            boolean isHtml = false;
            if (emailData.containsKey("isHtml")) {
                Object val = emailData.get("isHtml");
                if (val instanceof Boolean) {
                    isHtml = (Boolean) val;
                } else if (val instanceof String) {
                    isHtml = Boolean.parseBoolean((String) val);
                }
            }
            
            final boolean finalIsHtml = isHtml;
            
            java.util.List<User> recipients = userService.findAll().stream()
                .filter(u -> role.equalsIgnoreCase("all") || (u.getRole() != null && u.getRole().equalsIgnoreCase(role)))
                .collect(java.util.stream.Collectors.toList());
            
            recipients.forEach(u -> {
                if (finalIsHtml) {
                    emailService.sendHtmlEmail(u.getEmail(), subject, message);
                } else {
                    emailService.sendSimpleEmail(u.getEmail(), subject, message);
                }
            });
            
            return ResponseEntity.ok("Successfully sent email to " + recipients.size() + " " + (role.equalsIgnoreCase("all") ? "users" : role + "s") + ".");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending bulk email: " + e.getMessage());
        }
    }
}
