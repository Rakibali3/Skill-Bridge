package com.SkillBridge.skillbridge.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CookieService cookieService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String token = getTokenFromCookie(request);

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }


        try {

            if (jwtService.isValidToken(token)) {

                String email = jwtService.extractEmailFromToken(token);

                String role = jwtService.extractRoleFromToken(token);


                if (
                        email != null &&
                                role != null &&
                                SecurityContextHolder
                                        .getContext()
                                        .getAuthentication() == null
                ) {

                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    List.of(authority)
                            );


                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));


                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }

            } else {
                clearAuthentication(response);
            }

        } catch (Exception exception) {

            clearAuthentication(response);
        }


        filterChain.doFilter(request, response);
    }



    private void clearAuthentication(HttpServletResponse response) {

        SecurityContextHolder.clearContext();

        response.addHeader(
                HttpHeaders.SET_COOKIE,
                cookieService
                        .deleteAccessTokenCookie()
                        .toString()
        );
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