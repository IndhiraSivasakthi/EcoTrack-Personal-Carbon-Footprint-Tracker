package com.eco.ecotrackbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eco.ecotrackbackend.model.Activity;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

        List<Activity> findByUserId(Long userId);

        // ✅ Total CO2
        @Query("SELECT COALESCE(SUM(a.carbonValue), 0) FROM Activity a WHERE a.user.id = :userId")
        Double getTotalCO2(Long userId);

        // ✅ Today CO2
        @Query("SELECT COALESCE(SUM(a.carbonValue), 0) FROM Activity a WHERE a.user.id = :userId AND a.date = :today")
        Double getTodayCO2(Long userId, LocalDate today);

        // ✅ This week CO2
        @Query("SELECT COALESCE(SUM(a.carbonValue), 0) FROM Activity a WHERE a.user.id = :userId AND a.date >= :startDate")
        Double getWeekCO2(Long userId, LocalDate startDate);

        // ✅ Count activities
        @Query("SELECT COUNT(a) FROM Activity a WHERE a.user.id = :userId")
        Long getActivityCount(Long userId);

        @Query("""
    SELECT COALESCE(SUM(a.carbonValue), 0)
    FROM Activity a
    WHERE a.user.id = :userId
      AND a.date >= :startDate
      AND a.date < :endDate
""")
        Double getCO2BetweenDates(Long userId, LocalDate startDate, LocalDate endDate);
    }
