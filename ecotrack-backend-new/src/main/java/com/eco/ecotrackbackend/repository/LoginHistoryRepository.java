package com.eco.ecotrackbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eco.ecotrackbackend.model.LoginHistory;

import java.util.Optional;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {

    Optional<LoginHistory> findTopByUserIdOrderByLoginTimeDesc(Long userId);
}