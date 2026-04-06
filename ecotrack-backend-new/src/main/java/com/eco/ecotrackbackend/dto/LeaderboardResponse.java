package com.eco.ecotrackbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaderboardResponse {
    private int rank;
    private String name;
    private String email;
    private double weekCO2;
    private int ecoScore;
    private long activities;
}
