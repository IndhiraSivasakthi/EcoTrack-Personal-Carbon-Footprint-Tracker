package com.eco.ecotrackbackend.controller;

import com.eco.ecotrackbackend.dto.LeaderboardDto;
import com.eco.ecotrackbackend.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public List<LeaderboardDto> getLeaderboard() {
        return leaderboardService.getLeaderboard();
    }
}
