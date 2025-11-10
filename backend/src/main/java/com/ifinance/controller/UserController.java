package com.ifinance.controller;

import com.ifinance.model.dto.UserDto;
import com.ifinance.service.UserService;
import com.ifinance.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for user profile operations
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "User", description = "User profile management endpoints")
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "Get current user profile",
            description = "Returns the profile of the currently authenticated user"
    )
    @ApiResponse(responseCode = "200", description = "User profile retrieved successfully")
    @ApiResponse(responseCode = "401", description = "User not authenticated")
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUserProfile() {
        String userId = SecurityUtil.getCurrentUserId();
        UserDto userDto = userService.getUserProfile(userId);
        return ResponseEntity.ok(userDto);
    }

    @Operation(
            summary = "Update current user profile",
            description = "Updates the profile of the currently authenticated user (name only)"
    )
    @ApiResponse(responseCode = "200", description = "User profile updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    @ApiResponse(responseCode = "401", description = "User not authenticated")
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUserProfile(@Valid @RequestBody UserDto userDto) {
        String userId = SecurityUtil.getCurrentUserId();
        UserDto updatedUser = userService.updateUserProfile(userId, userDto);
        return ResponseEntity.ok(updatedUser);
    }
}
