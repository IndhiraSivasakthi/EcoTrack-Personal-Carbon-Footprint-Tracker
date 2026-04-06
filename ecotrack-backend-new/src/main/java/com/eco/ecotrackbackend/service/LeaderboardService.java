package com.eco.ecotrackbackend.service;

import com.eco.ecotrackbackend.dto.LeaderboardResponse;
import com.eco.ecotrackbackend.model.Activity;
import com.eco.ecotrackbackend.model.User;
import com.eco.ecotrackbackend.repository.ActivityRepository;
import com.eco.ecotrackbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    public List<LeaderboardResponse> getLeaderboard() {
        List<User> users = userRepository.findAll();
        List<LeaderboardResponse> result = new ArrayList<>();

        LocalDate today = LocalDate.now();
        LocalDate startOfWeekDate = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeekDate = startOfWeekDate.plusDays(6);

        LocalDateTime startOfWeek = startOfWeekDate.atStartOfDay();
        LocalDateTime endOfWeek = endOfWeekDate.atTime(23, 59, 59);

        for (User user : users) {
            List<Activity> weeklyActivities =
                    activityRepository.findByUserIdAndDateBetween(user.getId(), startOfWeek, endOfWeek);

            double weekCO2 = weeklyActivities.stream()
                    .mapToDouble(a -> a.getCarbonEmission() != null ? a.getCarbonEmission() : 0.0)
                    .sum();

            long activities = activityRepository.countByUserId(user.getId());

            int ecoScore = calculateEcoScore(weekCO2);

            result.add(new LeaderboardResponse(
                    0,
                    user.getName(),
                    user.getEmail(),
                    Math.round(weekCO2 * 10.0) / 10.0,
                    ecoScore,
                    activities
            ));
        }

        result.sort(Comparator
                .comparingDouble(LeaderboardResponse::getWeekCO2)
                .thenComparing(Comparator.comparingInt(LeaderboardResponse::getEcoScore).reversed()));

        for (int i = 0; i < result.size(); i++) {
            result.get(i).setRank(i + 1);
        }

        return result;
    }

    private int calculateEcoScore(double weekCO2) {
        if (weekCO2 <= 5) return 95;
        if (weekCO2 <= 10) return 85;
        if (weekCO2 <= 15) return 70;
        if (weekCO2 <= 20) return 55;
        if (weekCO2 <= 25) return 40;
        return 20;
    }
}
