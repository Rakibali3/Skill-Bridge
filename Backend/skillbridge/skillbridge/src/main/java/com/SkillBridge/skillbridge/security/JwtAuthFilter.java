package com.SkillBridge.skillbridge.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromCookie(request);
        if(token == null){
            filterChain.doFilter(request,response);
            return;
        }
        try {
            if (jwtService.isValidToken(token)) {

                String email = jwtService.extractEmailFromToken(token);

                // Make sure request is not already authenticated
                if (
                        email != null
                                && SecurityContextHolder
                                .getContext()
                                .getAuthentication() == null
                ) {

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    Collections.emptyList()
                            );

                    // Attach request details
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Store authentication
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }catch(Exception exception){
            // Invalid or expired JWT
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(request, response);
    }

    private String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {

            if ("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
