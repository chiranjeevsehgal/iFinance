package com.ifinance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * MongoDB configuration
 * Enables auditing for @CreatedDate and @LastModifiedDate annotations
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {
    // MongoDB auditing is enabled via @EnableMongoAuditing annotation
    // No additional configuration needed for basic setup
}
