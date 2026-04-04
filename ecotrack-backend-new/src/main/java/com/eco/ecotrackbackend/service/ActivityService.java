package com.eco.ecotrackbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.eco.ecotrackbackend.model.Activity;
import com.eco.ecotrackbackend.model.User;
import com.eco.ecotrackbackend.repository.ActivityRepository;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository repo;

    public Activity save(Activity activity, User user) {

        activity.setUser(user);

        double carbon = calculateCarbon(activity);

        activity.setCarbonValue(carbon);

        return repo.save(activity);
    }

    public List<Activity> getUserActivities(Long userId) {
        return repo.findByUserId(userId);
    }

    // ✅ MAIN CALCULATION METHOD
    private double calculateCarbon(Activity a) {

        switch (a.getType().toLowerCase()) {

            case "transport":
                return transportCarbon(a);

            case "food":
                return foodCarbon(a);

            case "energy":
                return energyCarbon(a);

            default:
                return 0;
        }
    }

    // 🚗 TRANSPORT LOGIC
    private double transportCarbon(Activity a) {
        double base = switch (a.getSubtype()) {
            case "Car" -> 0.21;
            case "Bike" -> 0.05;
            case "Bus" -> 0.08;
            case "Train" -> 0.04;
            default -> 0;
        };

        // Fuel adjustment
        if ("petrol".equalsIgnoreCase(a.getFuelType())) base *= 1.0; // default

        if ("diesel".equalsIgnoreCase(a.getFuelType())) base *= 1.1;
        if ("cng".equalsIgnoreCase(a.getFuelType())) base *= 0.8;
        if ("electric".equalsIgnoreCase(a.getFuelType())) base *= 0.3;

        double distance = a.getQuantity();

        // Round trip
        if ("round-trip".equalsIgnoreCase(a.getDistanceType())) {
            distance *= 2;
        }

        return distance * base;
    }

    private double foodCarbon(Activity a) {

        String diet = a.getDietType();
        double base;

        if (diet != null) {
            base = switch (diet.toLowerCase()) {
                case "vegetarian" -> 0.5;
                case "non-veg" -> 2.5;
                case "dairy" -> 1.2;
                case "mixed" -> 1.5;
                default -> 1.0;
            };
        } else {
            base = 1.0;
        }

        // Meal weight
        String weight = a.getMealWeight();
        if (weight != null) {
            switch (weight.toLowerCase()) {
                case "light": base *= 0.8; break;
                case "heavy": base *= 1.3; break;
                case "normal":
                default: base *= 1.0;
            }
        }

        // Region
        String region = a.getRegion();
        if ("western".equalsIgnoreCase(region)) {
            base *= 1.2;
        } else {
            base *= 1.0; // indian or default
        }

        return a.getQuantity() * base;
    }
    // ⚡ ENERGY LOGIC
    private double energyCarbon(Activity a) {
        double base = switch (a.getSubtype()) {
            case "Electricity" -> 0.82;
            case "LPG Gas" -> 0.15;
            case "AC Usage" -> 1.2;
            default -> 0;
        };

        // Appliance adjustment
        String type = a.getApplianceType();

        if (type != null) {
            switch (type.toLowerCase()) {
                case "ac": base *= 1.5; break;
                case "fan": base *= 0.3; break;
                case "fridge": base *= 1.2; break;
                case "washing-machine": base *= 1.1; break;
                case "general":
                default: base *= 1.0;
            }
        }
        return a.getQuantity() * base;
    }
    public Map<String, Object> getDashboard(Long userId) {
        LocalDate today = LocalDate.now();

        LocalDate weekStart = today.with(DayOfWeek.MONDAY);
        LocalDate nextWeekStart = weekStart.plusWeeks(1);

        LocalDate lastWeekStart = weekStart.minusWeeks(1);
        LocalDate lastWeekEnd = weekStart;

        Double total = repo.getTotalCO2(userId);
        Double todayCO2 = repo.getTodayCO2(userId, today);
        Double weekCO2 = repo.getCO2BetweenDates(userId, weekStart, nextWeekStart);
        Double lastWeekCO2 = repo.getCO2BetweenDates(userId, lastWeekStart, lastWeekEnd);
        Long count = repo.getActivityCount(userId);

        double ecoScore = calculateEcoScore(weekCO2, todayCO2, count);

        Map<String, Object> data = new HashMap<>();
        data.put("totalCO2", total);
        data.put("todayCO2", todayCO2);
        data.put("weekCO2", weekCO2);
        data.put("lastWeekCO2", lastWeekCO2);
        data.put("activities", count);
        data.put("ecoScore", ecoScore);
        data.put("ecoScoreToday", calculateDailyEcoScore(todayCO2));

        return data;
    }
    private double calculateEcoScore(Double weekCO2, Double todayCO2, Long count) {
        // Simple scoring: lower CO2 = higher score
        double avgDaily = weekCO2 != null ? weekCO2 / 7.0 : 0;
        double score = Math.max(0, 100 - (avgDaily * 10)); // 1kg/day avg = 90 score
        return Math.min(100, score);
    }

    private double calculateDailyEcoScore(Double todayCO2) {
        double score = Math.max(0, 100 - (todayCO2 * 10)); // 5kg/day = 0 score
        return Math.min(100, score);
    }

    public Map<String, Object> getGoalsProgress(Long userId) {
        Map<String, Object> progress = new HashMap<>();

        Double currentWeekCO2 = repo.getWeekCO2(userId, LocalDate.now().with(DayOfWeek.MONDAY));
        double goalCO2 = 15.0;

        double current = currentWeekCO2 != null ? currentWeekCO2 : 0.0;
        double progressPercent = Math.min(100, (current / goalCO2) * 100);

        progress.put("currentWeekCO2", current);
        progress.put("goalCO2", goalCO2);
        progress.put("progressPercent", Math.round(progressPercent));

        return progress;
    }

    public Map<String, Double> getWeeklyTrend(Long userId) {
        Map<String, Double> data = new LinkedHashMap<>();

        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);

            Double value = repo.getTodayCO2(userId, date);
            data.put(date.getDayOfWeek().toString(), value);
        }

        return data;
    }
    public Map<String, Double> getCategoryBreakdown(Long userId) {
        List<Activity> activities = repo.findByUserId(userId);

        Map<String, Double> map = new HashMap<>();

        for (Activity a : activities) {
            map.put(
                    a.getType(),
                    map.getOrDefault(a.getType(), 0.0) + a.getCarbonValue()
            );
        }

        return map;
    }
}