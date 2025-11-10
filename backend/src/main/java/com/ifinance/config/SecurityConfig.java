package com.ifinance.config;

import com.ifinance.security.CustomOAuth2UserService;
import com.ifinance.security.OAuth2LoginSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;

/**
 * Spring Security configuration with OAuth2 Google authentication
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler oauth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Authorize requests
            .authorizeHttpRequests(auth -> auth
                    // Public endpoints
                    .requestMatchers("/", "/login", "/oauth2/**", "/error").permitAll()
                    .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                    .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                    
                    // All API endpoints require authentication
                    .requestMatchers("/api/**").authenticated()
                    
                    // Any other request requires authentication
                    .anyRequest().authenticated()
            )
            
            // OAuth2 login configuration
            .oauth2Login(oauth2 -> oauth2
                    .userInfoEndpoint(userInfo -> userInfo
                            .userService(customOAuth2UserService)
                    )
                    .successHandler(oauth2LoginSuccessHandler)
                    .failureUrl("http://localhost:4200/login?error=true")
            )
            
            // Logout configuration
            .logout(logout -> logout
                    .logoutUrl("/logout")
                    .logoutSuccessHandler(logoutSuccessHandler())
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
            )
            
            // CSRF configuration - enable for production
            .csrf(AbstractHttpConfigurer::disable); // Disabled for development, enable in production

        return http.build();
    }

    @Bean
    public SimpleUrlLogoutSuccessHandler logoutSuccessHandler() {
        SimpleUrlLogoutSuccessHandler handler = new SimpleUrlLogoutSuccessHandler();
        handler.setDefaultTargetUrl("http://localhost:4200/login");
        handler.setUseReferer(false);
        return handler;
    }
}
