package com.eco.ecotrackbackend.dto;

public class LeaderboardRow {
    private String name;
    private String email;
    private Double totalCO2;
    private Long activityCount;

    public LeaderboardRow(String name, String email, Double totalCO2, Long activityCount) {
        this.name = name;
        this.email = email;
        this.totalCO2 = totalCO2;
        this.activityCount = activityCount;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Double getTotalCO2() {
        return totalCO2;
    }

    public Long getActivityCount() {
        return activityCount;
    }
}
