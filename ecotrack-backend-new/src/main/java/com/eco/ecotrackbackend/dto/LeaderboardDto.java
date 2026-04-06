package com.eco.ecotrackbackend.dto;

public class LeaderboardDto {
    private int rank;
    private String name;
    private String email;
    private Double totalCO2;
    private Long activityCount;

    public LeaderboardDto() {
    }

    public LeaderboardDto(int rank, String name, String email, Double totalCO2, Long activityCount) {
        this.rank = rank;
        this.name = name;
        this.email = email;
        this.totalCO2 = totalCO2;
        this.activityCount = activityCount;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
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
