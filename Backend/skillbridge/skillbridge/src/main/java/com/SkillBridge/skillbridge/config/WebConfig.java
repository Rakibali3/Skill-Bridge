package com.SkillBridge.skillbridge.config;

import com.SkillBridge.skillbridge.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
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
//    private final UserDetailsService userDetailsService;

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity){
      return httpSecurity
              .csrf(csrfConfig -> csrfConfig.disable())
              .cors(cors -> cors.configurationSource(corsConfigurationSource()))
              .authorizeHttpRequests(requests -> requests
                      .requestMatchers(HttpMethod.POST, "/signup").permitAll()
                      .requestMatchers(HttpMethod.POST, "/login").permitAll()
                      .anyRequest().authenticated())
              .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
              .logout(logout -> logout.disable())
              .addFilterBefore(
                      jwtAuthFilter,
                      UsernamePasswordAuthenticationFilter.class
              )
              .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

//    @Bean
//    public AuthenticationProvider authenticationProvider(){
//        return new DaoAuthenticationProvider(userDetailsService);
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration){
//        return configuration.getAuthenticationManager();
//    }
     @Bean
     public ModelMapper modelMapper() {
          return new ModelMapper();
     }

}
