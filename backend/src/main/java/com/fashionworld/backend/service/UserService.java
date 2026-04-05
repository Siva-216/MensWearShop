package com.fashionworld.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fashionworld.backend.dto.LoginRequest;
import com.fashionworld.backend.dto.LoginResponse;
import com.fashionworld.backend.dto.RegisterRequest;
import com.fashionworld.backend.model.User;
import com.fashionworld.backend.repository.UserRepository;
import com.fashionworld.backend.security.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    public User register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setMobile(registerRequest.getMobile());
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : "USER");

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        user.setPassword(null); // Clear password before sending to response

        return new LoginResponse(jwt, user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(String id, RegisterRequest updateData) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

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

        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
}
