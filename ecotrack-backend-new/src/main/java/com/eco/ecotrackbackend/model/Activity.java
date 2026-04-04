package com.eco.ecotrackbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String subtype;

    private Double quantity;
    private String unit;

    private Double carbonValue;

    private LocalDate date;
    private String notes;

    // ✅ TRANSPORT
    private String distanceType;
    private String fuelType;

    // ✅ FOOD
    private String dietType;
    private String mealWeight;
    private String region;

    // ✅ ENERGY
    private String applianceType;

    // ✅ USER LINK
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}