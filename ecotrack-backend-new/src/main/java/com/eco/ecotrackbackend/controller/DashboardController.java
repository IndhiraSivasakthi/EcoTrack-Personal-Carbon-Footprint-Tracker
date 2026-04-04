package com.eco.ecotrackbackend.controller;

import com.eco.ecotrackbackend.model.User;
import com.eco.ecotrackbackend.service.ActivityService;
import com.eco.ecotrackbackend.service.AuthService;
import com.eco.ecotrackbackend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")

@RequiredArgsConstructor

public class DashboardController {


        private final ActivityService activityService;
        private final JwtService jwtService;
        private final AuthService authService;

        @GetMapping
        public Map<String, Object> getDashboard(
                @RequestHeader("Authorization") String header) {

            String token = header.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            User user = authService.findByEmail(email);

            return activityService.getDashboard(user.getId());
        }
    }

