package com.freelanceapp.service;

import com.freelanceapp.model.User;
import com.freelanceapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    public User loginUser(String username, String plainTextPassword) {
        // Find user by username first
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && passwordEncoder.matches(plainTextPassword, user.getPassword())) {
            // If user exists and passwords match, return user
            return user;
        }
        // Otherwise, return null
        return null;
    }
}