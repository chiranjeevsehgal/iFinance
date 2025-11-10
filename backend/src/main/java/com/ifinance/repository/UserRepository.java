package com.ifinance.repository;

import com.ifinance.model.document.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User document operations
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Find user by Google OAuth2 ID
     * 
     * @param googleId Google OAuth2 ID
     * @return Optional of User
     */
    Optional<User> findByGoogleId(String googleId);

    /**
     * Find user by email address
     * 
     * @param email Email address
     * @return Optional of User
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if user exists by Google OAuth2 ID
     * 
     * @param googleId Google OAuth2 ID
     * @return true if exists
     */
    boolean existsByGoogleId(String googleId);
}
