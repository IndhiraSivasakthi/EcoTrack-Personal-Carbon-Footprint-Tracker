package com.eco.ecotrackbackend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // ✅ internal DB ID

    @Column(unique = true, nullable = false)
    private String ecoId;   // ✅ public ID (ECO-xxxx)

    private String name;
    private String email;
    private String password;
}