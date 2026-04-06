package com.eco.ecotrackbackend.service;

import com.eco.ecotrackbackend.dto.LeaderboardDto;
import com.eco.ecotrackbackend.dto.LeaderboardRow;
import com.eco.ecotrackbackend.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final ActivityRepository activityRepository;

    public List<LeaderboardDto> getLeaderboard() {
        List<LeaderboardRow> rows = activityRepository.getLeaderboardData();
        List<LeaderboardDto> leaderboard = new ArrayList<>();

        int rank = 1;
        for (LeaderboardRow row : rows) {
            leaderboard.add(new LeaderboardDto(
                    rank++,
                    row.getName(),
                    row.getEmail(),
                    row.getTotalCO2(),
                    row.getActivityCount()
            ));
        }

        return leaderboard;
    }
}
