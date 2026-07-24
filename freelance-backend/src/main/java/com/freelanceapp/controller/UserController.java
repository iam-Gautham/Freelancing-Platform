package com.freelanceapp.controller;

import com.freelanceapp.dto.LoginRequest;
import com.freelanceapp.dto.UserRegistrationRequest;
import com.freelanceapp.model.User;
import com.freelanceapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationRequest req) {
        try {
            User newUser = new User();
            newUser.setUsername(req.getUsername());
            newUser.setPassword(req.getPassword());
            newUser.setEmail(req.getEmail());
            newUser.setUserType(req.getUserType());
            User savedUser = userService.registerUser(newUser);
            return ResponseEntity.ok(savedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody LoginRequest req) {
        User user = userService.loginUser(req.getUsername(), req.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).build();
    }
}