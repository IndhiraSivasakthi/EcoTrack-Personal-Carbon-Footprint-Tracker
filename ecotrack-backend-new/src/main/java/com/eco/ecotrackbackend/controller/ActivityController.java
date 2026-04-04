package com.eco.ecotrackbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.eco.ecotrackbackend.model.*;
import com.eco.ecotrackbackend.service.*;

import java.util.Map;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityService activityService;
    private final JwtService jwtService;
    private final AuthService authService;

    @PostMapping
    public Activity saveActivity(
            @RequestBody Activity activity,
            @RequestHeader("Authorization") String header
    ) {
        String token = header.replace("Bearer ", "");
        String email = jwtService.extractEmail(token);

        User user = authService.findByEmail(email);

        return activityService.save(activity, user);
    }
    @GetMapping("/trend")
    public Map<String, Double> getTrend(@RequestHeader("Authorization") String header) {
        String email = jwtService.extractEmail(header.replace("Bearer ", ""));
        User user = authService.findByEmail(email);
        return activityService.getWeeklyTrend(user.getId());
    }

    @GetMapping("/category")
    public Map<String, Double> getCategory(@RequestHeader("Authorization") String header) {
        String email = jwtService.extractEmail(header.replace("Bearer ", ""));
        User user = authService.findByEmail(email);
        return activityService.getCategoryBreakdown(user.getId());
    }
}