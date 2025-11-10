package com.ifinance.security;

import com.ifinance.model.document.User;
import com.ifinance.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Custom OAuth2 User Service
 * Loads user from OAuth2 provider and adds custom attributes
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Load OAuth2 user from Google
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        log.debug("Loading OAuth2 user with attributes: {}", oauth2User.getAttributes());

        // Get or create user in our database
        User user = userService.createOrUpdateUser(oauth2User);
        
        // Add userId to OAuth2User attributes for later use
        Map<String, Object> attributes = new HashMap<>(oauth2User.getAttributes());
        attributes.put("userId", user.getId());
        
        log.debug("User loaded/created with ID: {}", user.getId());

        // Return OAuth2User with custom attributes
        return new DefaultOAuth2User(
                oauth2User.getAuthorities(),
                attributes,
                "sub" // nameAttributeKey (Google uses 'sub' for user ID)
        );
    }
}
