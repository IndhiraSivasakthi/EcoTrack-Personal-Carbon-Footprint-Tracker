package com.eco.ecotrackbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.eco.ecotrackbackend.model.User;
import com.eco.ecotrackbackend.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;

    // ✅ Password encoder
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ REGISTER
    public User register(User user) {

        // 🔒 Check if email already exists
        if (repo.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // ✅ Generate ECO ID
        String ecoId = "ECO-" + UUID.randomUUID().toString().substring(0, 6);
        user.setEcoId(ecoId);

        // 🔒 Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return repo.save(user);
    }

    // ✅ LOGIN
    public User login(String email, String password) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔒 Compare encrypted password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    // ✅ FIND USER
    public User findByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}