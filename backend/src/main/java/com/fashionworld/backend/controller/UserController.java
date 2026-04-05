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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fashionworld.backend.dto.LoginRequest;
import com.fashionworld.backend.dto.LoginResponse;
import com.fashionworld.backend.dto.RegisterRequest;
import com.fashionworld.backend.model.User;
import com.fashionworld.backend.security.JwtUtil;
import com.fashionworld.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Update according to frontend requirements
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.register(registerRequest);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = userService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtil.extractUsername(jwt);
            User user = userService.findByEmail(email).orElseThrow();
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable String id, @RequestBody RegisterRequest updateData,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtil.extractUsername(jwt);
            User currentUser = userService.findByEmail(email).orElseThrow();

            // Simple security: Allow only self-update or admin
            if (!currentUser.getId().equals(id) && !"ADMIN".equals(currentUser.getRole())) {
                return ResponseEntity.status(403).body("You are not authorized to update this profile");
            }

            User updatedUser = userService.updateUser(id, updateData);
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable String id, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtil.extractUsername(jwt);
            User currentUser = userService.findByEmail(email).orElseThrow();

            // Simple security: Allow only self-deletion or admin
            if (!currentUser.getId().equals(id) && !"ADMIN".equals(currentUser.getRole())) {
                return ResponseEntity.status(403).body("You are not authorized to delete this account");
            }

            userService.deleteUser(id);
            return ResponseEntity.ok("User account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting account: " + e.getMessage());
        }
    }
}
