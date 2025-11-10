package com.ifinance.util;

import com.ifinance.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;

/**
 * Utility class for security-related operations
 */
public class SecurityUtil {

    /**
     * Get the current authenticated user's ID (MongoDB _id)
     * 
     * @return User ID
     * @throws UnauthorizedException if user is not authenticated
     */
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User is not authenticated");
        }

        Object principal = authentication.getPrincipal();
        
        if (principal instanceof OAuth2User oauth2User) {
            // Get userId from OAuth2User attributes (set during authentication)
            Object userId = oauth2User.getAttribute("userId");
            if (userId == null) {
                throw new UnauthorizedException("User ID not found in authentication context");
            }
            return userId.toString();
        }

        throw new UnauthorizedException("Invalid authentication principal");
    }

    /**
     * Get the current authenticated user's Google ID
     * 
     * @return Google ID
     * @throws UnauthorizedException if user is not authenticated
     */
    public static String getCurrentGoogleId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User is not authenticated");
        }

        Object principal = authentication.getPrincipal();
        
        if (principal instanceof OAuth2User oauth2User) {
            // Get sub (Google ID) from OAuth2User attributes
            Object googleId = oauth2User.getAttribute("sub");
            if (googleId == null) {
                throw new UnauthorizedException("Google ID not found in authentication context");
            }
            return googleId.toString();
        }

        throw new UnauthorizedException("Invalid authentication principal");
    }

    /**
     * Get the current authenticated user's email
     * 
     * @return Email address
     * @throws UnauthorizedException if user is not authenticated
     */
    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User is not authenticated");
        }

        Object principal = authentication.getPrincipal();
        
        if (principal instanceof OAuth2User oauth2User) {
            Object email = oauth2User.getAttribute("email");
            if (email == null) {
                throw new UnauthorizedException("Email not found in authentication context");
            }
            return email.toString();
        }

        throw new UnauthorizedException("Invalid authentication principal");
    }
}
