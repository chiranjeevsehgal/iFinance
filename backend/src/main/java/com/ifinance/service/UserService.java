package com.ifinance.service;

import com.ifinance.exception.ResourceNotFoundException;
import com.ifinance.model.document.User;
import com.ifinance.model.dto.UserDto;
import com.ifinance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service for user management operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Create or update user from OAuth2 authentication
     * Called during OAuth2 login success
     * 
     * @param oauth2User OAuth2 user from Google
     * @return Created or updated User
     */
    @Transactional
    public User createOrUpdateUser(OAuth2User oauth2User) {
        String googleId = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        log.debug("Creating or updating user with Google ID: {}, Email: {}", googleId, email);

        return userRepository.findByGoogleId(googleId)
                .map(existingUser -> {
                    // Update existing user
                    existingUser.setEmail(email);
                    existingUser.setName(name);
                    existingUser.setProfilePicture(picture);
                    existingUser.setLastLogin(LocalDateTime.now());
                    log.debug("Updating existing user: {}", existingUser.getId());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    // Create new user
                    User newUser = User.builder()
                            .googleId(googleId)
                            .email(email)
                            .name(name)
                            .profilePicture(picture)
                            .lastLogin(LocalDateTime.now())
                            .build();
                    log.info("Creating new user with email: {}", email);
                    return userRepository.save(newUser);
                });
    }

    /**
     * Get user profile by user ID
     * 
     * @param userId User ID
     * @return UserDto
     */
    public UserDto getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return mapToDto(user);
    }

    /**
     * Get user by Google ID
     * 
     * @param googleId Google OAuth2 ID
     * @return User
     */
    public User getUserByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "googleId", googleId));
    }

    /**
     * Update user profile
     * 
     * @param userId User ID
     * @param userDto Updated user data
     * @return Updated UserDto
     */
    @Transactional
    public UserDto updateUserProfile(String userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Only allow updating name (other fields come from Google)
        if (userDto.getName() != null) {
            user.setName(userDto.getName());
        }

        User updatedUser = userRepository.save(user);
        log.debug("Updated user profile: {}", userId);
        
        return mapToDto(updatedUser);
    }

    /**
     * Map User document to UserDto
     * 
     * @param user User document
     * @return UserDto
     */
    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profilePicture(user.getProfilePicture())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
