package com.SkillBridge.skillbridge.config;

import com.SkillBridge.skillbridge.security.JwtAuthFilter;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class WebConfig {

    private final JwtAuthFilter jwtAuthFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        return httpSecurity

                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .authorizeHttpRequests(requests ->
                        requests

                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                // Public endpoints
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/signup"
                                ).permitAll()

                                .requestMatchers(HttpMethod.POST, "/login").permitAll()

                                .requestMatchers("/ws/**").permitAll()
                                .requestMatchers("/admin/**").hasRole("ADMIN")

                                .anyRequest().authenticated()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .logout(logout ->
                        logout.disable()
                )

                .exceptionHandling(exception ->
                        exception

                                .authenticationEntryPoint(
                                        (request, response, authException) ->
                                                response.sendError(
                                                        HttpStatus.UNAUTHORIZED.value(),
                                                        "Authentication required"
                                                )
                                )

                                .accessDeniedHandler(
                                        (request, response, accessDeniedException) ->
                                                response.sendError(
                                                        HttpStatus.FORBIDDEN.value(),
                                                        "Access denied"
                                                )
                                )
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(
                List.of(
                        "https://skill-bridge-pi-seven.vercel.app",
                        "http://localhost:5173"
                )
        );


        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );


        configuration.setAllowedHeaders(
                List.of("*")
        );


        // Required because authentication uses cookies.
        configuration.setAllowCredentials(true);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}