package com.ifinance.model.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * User document representing an authenticated user
 * Users sign in with Google OAuth2
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    /**
     * Google OAuth2 ID - unique identifier from Google
     */
    @Indexed(unique = true)
    private String googleId;

    /**
     * Email address from Google account
     */
    @Indexed(unique = true)
    private String email;

    /**
     * Full name from Google account
     */
    private String name;

    /**
     * Profile picture URL from Google account
     */
    private String profilePicture;

    /**
     * Timestamp when user was created
     */
    @CreatedDate
    private LocalDateTime createdAt;

    /**
     * Timestamp of last login
     */
    private LocalDateTime lastLogin;

    /**
     * Timestamp when user was last updated
     */
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
