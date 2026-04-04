package com.eco.ecotrackbackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Relation with User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime loginTime;
    private LocalDateTime logoutTime;
}