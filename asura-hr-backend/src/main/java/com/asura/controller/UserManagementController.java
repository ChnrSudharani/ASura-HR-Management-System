package com.asura.controller;

import com.asura.dto.ResetPasswordRequest;
import com.asura.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
public class UserManagementController {

    private final AuthService authService;

    public UserManagementController(AuthService authService) {
        this.authService = authService;
    }

    @PatchMapping("/password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        if (request.getEmail() == null
                || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Email address is required.");
        }

        if (request.getNewPassword() == null
                || request.getNewPassword().length() < 8) {
            return ResponseEntity.badRequest()
                    .body("New password must contain at least 8 characters.");
        }

        try {
            authService.resetPasswordByEmail(
                    request.getEmail(),
                    request.getNewPassword()
            );

            return ResponseEntity.ok(
                    "Password reset successfully."
            );

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(exception.getMessage());
        }
    }
}