package com.ifinance.security;

import com.ifinance.model.document.User;
import com.ifinance.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Handler for successful OAuth2 login
 * Creates or updates user in database after Google authentication
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        
        String userEmail = oauth2User.getAttribute("email");
        log.info("OAuth2 login successful for user: {}", userEmail);

        try {
            // Create or update user in database
            User user = userService.createOrUpdateUser(oauth2User);
            log.info("User created/updated successfully with ID: {}", user.getId());

            // Store userId in session attributes for later use
            request.getSession().setAttribute("userId", user.getId());
            
            // Redirect to frontend after successful login
            String targetUrl = determineTargetUrl(request, response, authentication);
            if (response.isCommitted()) {
                log.debug("Response has already been committed. Unable to redirect to " + targetUrl);
                return;
            }

            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } catch (Exception e) {
            log.error("Error during OAuth2 login success handling", e);
            throw new IOException("Failed to process OAuth2 login", e);
        }
    }

    @Override
    protected String determineTargetUrl(HttpServletRequest request, 
                                        HttpServletResponse response, 
                                        Authentication authentication) {
        // Redirect to frontend dashboard after successful login
        return "http://localhost:4200/dashboard";
    }
}
