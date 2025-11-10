package com.ifinance.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Welcome controller for root endpoint
 */
@RestController
public class WelcomeController {

    @GetMapping("/")
    public Map<String, String> welcome() {
        return Map.of(
                "application", "iFinance API",
                "version", "1.0.0",
                "description", "Personal Finance Management Application",
                "documentation", "/swagger-ui.html"
        );
    }
}
