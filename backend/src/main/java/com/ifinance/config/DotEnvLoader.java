package com.ifinance.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Loads environment variables from .env file before Spring Boot application starts.
 * This ensures properties are available during application context initialization.
 */
public class DotEnvLoader implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        File envFile = new File(".env");
        
        if (!envFile.exists()) {
            System.out.println("⚠️  .env file not found. Using default configuration.");
            return;
        }

        Map<String, Object> envProperties = new HashMap<>();
        
        try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                
                // Skip empty lines and comments
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                
                // Parse key=value
                int separatorIndex = line.indexOf('=');
                if (separatorIndex > 0) {
                    String key = line.substring(0, separatorIndex).trim();
                    String value = line.substring(separatorIndex + 1).trim();
                    envProperties.put(key, value);
                }
            }
            
            // Add properties to Spring environment with high priority
            environment.getPropertySources().addFirst(
                    new MapPropertySource("dotenvProperties", envProperties)
            );
            
            System.out.println("✓ Successfully loaded .env file with " + envProperties.size() + " properties");
            
        } catch (IOException e) {
            System.err.println("⚠️  Error reading .env file: " + e.getMessage());
        }
    }
}
