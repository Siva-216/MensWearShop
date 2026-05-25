package com.fashionworld.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.model.User;
import com.fashionworld.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(user.getRole() != null ? user.getRole() : "USER");

        return userRepository.save(user);
    }

    public User login(User loginUser) {
        User user = userRepository.findByEmail(loginUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + loginUser.getEmail()));

        if (!passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        user.setPassword(null); // Clear password before sending to response
        return user;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User updateUser(String id, User updateData) {
        User user = userRepository.findById(id)
                .or(() -> userRepository.findByEmail(id))
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        if (updateData.getName() != null) user.setName(updateData.getName());
        if (updateData.getEmail() != null) {
            // Check if email is already taken by another user
            if (!user.getEmail().equals(updateData.getEmail()) && userRepository.existsByEmail(updateData.getEmail())) {
                throw new RuntimeException("Email already taken");
            }
            user.setEmail(updateData.getEmail());
        }
        if (updateData.getMobile() != null) user.setMobile(updateData.getMobile());
        if (updateData.getPassword() != null && !updateData.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateData.getPassword()));
        }
        if (updateData.getRole() != null) user.setRole(updateData.getRole());
        if (updateData.getAddresses() != null) user.setAddresses(updateData.getAddresses());

        return userRepository.save(user);
    }

    public java.util.List<User> findAll() {
        return userRepository.findAll();
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public String generateResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String token = java.util.UUID.randomUUID().toString();
        user.setResetToken(token);
        
        // Expiry set to 1 hour from now
        long ONE_HOUR_IN_MS = 3600000;
        user.setResetTokenExpiry(new java.util.Date(System.currentTimeMillis() + ONE_HOUR_IN_MS));

        userRepository.save(user);
        return token;
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid password reset token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().before(new java.util.Date())) {
            throw new RuntimeException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }
}
