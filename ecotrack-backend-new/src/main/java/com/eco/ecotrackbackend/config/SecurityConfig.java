package com.eco.ecotrackbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ❌ Disable CSRF (for REST APIs)
                .csrf(csrf -> csrf.disable())

                // ❌ Disable default login popup
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // ✅ Allow public APIs
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/activity/**").permitAll()
                        .requestMatchers("/api/dashboard/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()
                        .anyRequest().permitAll()   // ✅ ONLY THIS
                );

        return http.build();
    }

    // ✅ Password encoder bean
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
