package com.eco.ecotrackbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.eco.ecotrackbackend.dto.AuthRequest;
import com.eco.ecotrackbackend.dto.AuthResponse;
import com.eco.ecotrackbackend.model.User;
import com.eco.ecotrackbackend.model.LoginHistory;
import com.eco.ecotrackbackend.repository.LoginHistoryRepository;
import com.eco.ecotrackbackend.service.AuthService;
import com.eco.ecotrackbackend.service.JwtService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final LoginHistoryRepository loginHistoryRepository;

    // ✅ REGISTER
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        authService.register(user);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {

        User user = authService.login(request.getEmail(), request.getPassword());

        // ✅ SAVE LOGIN HISTORY (already you added)
        LoginHistory history = new LoginHistory();
        history.setUser(user);
        history.setLoginTime(java.time.LocalDateTime.now());
        loginHistoryRepository.save(history);

        String token = jwtService.generateToken(user.getEmail());

        // ✅ RETURN NAME + EMAIL ALSO
        return new AuthResponse(token, user.getName(), user.getEmail());
    }

    // ✅ LOGOUT (JWT-based, no email param)
    @PostMapping("/logout")
    public String logout(@RequestHeader("Authorization") String header) {

        String token = header.replace("Bearer ", "");

        // ✅ GET EMAIL FROM TOKEN
        String email = jwtService.extractEmail(token);

        User user = authService.findByEmail(email);

        // ✅ GET LAST LOGIN RECORD
        LoginHistory history = loginHistoryRepository
                .findTopByUserIdOrderByLoginTimeDesc(user.getId())
                .orElseThrow(() -> new RuntimeException("No login record found"));

        // ✅ SET LOGOUT TIME
        history.setLogoutTime(java.time.LocalDateTime.now());

        loginHistoryRepository.save(history);

        return "Logged out successfully";
    }
}