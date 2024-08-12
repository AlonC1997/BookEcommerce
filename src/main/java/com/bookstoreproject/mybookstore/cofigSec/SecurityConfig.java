package com.bookstoreproject.mybookstore.cofigSec;

import com.bookstoreproject.mybookstore.JWT.JwtAuthEntryPoint;
import com.bookstoreproject.mybookstore.JWT.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    public static final String MAIN_ADMIN = "MAIN_ADMIN";
    public static final String ADMIN = "ADMIN";
    public static final String USER = "USER";

    @Autowired
    private JwtAuthEntryPoint authEntryPoint;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults()) // Enable Cross-Origin Resource Sharing
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF protection if not using cookies for sessions

                // Configure session management
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Use stateless session management for JWT-based authentication
                )

                // Configure exception handling
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling.authenticationEntryPoint(authEntryPoint) // Custom authentication entry point
                )

                // Configure security for HTTP requests
                .authorizeHttpRequests(authz -> authz
                        // Publicly accessible endpoints
                        .requestMatchers(
                                "/auth/**",
                                "/books/getAllBooks",
                                "/books/getStockQuantity",
                                "/books/getBook",
                                "/orders/getUserOrders",
                                "/users/getLoggedInUserId",
                                "/orders/getLastOrderId",
                                "/orders/deleteOrder",
                                "/careers/getAllCareers",
                                "/careers/uploadFiles"
                        ).permitAll()

                        // Endpoints accessible by USER role
                        .requestMatchers(
                                "/carts/**",
                                "/users/getLoggedInUser",
                                "/users/setAddress",
                                "/users/setName",
                                "/orders/getUserOrdersWithOutId"
                        ).hasAuthority(USER)

                        // Endpoints accessible by ADMIN role
                        .requestMatchers(
                                "/books/**",
                                "/orders/**"
                        ).hasAuthority(ADMIN)

                        // Endpoints accessible by MAIN_ADMIN role
                        .requestMatchers(
                                "/users/**",
                                "/careers/**"
                        ).hasAuthority(MAIN_ADMIN)

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )

                // Add custom JWT authentication filter
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();

        /* Attention !!!! So you wont be confused... */
        String hierarchy = "MAIN_ADMIN > ADMIN\nADMIN > USER"; /* This means that MAIN_ADMIN has all the privileges of ADMIN and USER, and ADMIN has all the privileges of USER BUT!!!
        MAIN_ADMIN and ADMIN  don't have access for some USER functions USER and vice versa.  (You can see it in filterChain function and in addition in the frontend side implementation. */

        roleHierarchy.setHierarchy(hierarchy);
        return roleHierarchy;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // Allow all origins with pattern matching
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
