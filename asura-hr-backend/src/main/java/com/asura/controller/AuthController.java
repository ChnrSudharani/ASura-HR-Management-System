package com.asura.controller;

import com.asura.dto.LoginRequest;
import com.asura.dto.UserResponse;
import com.asura.entity.User;
import com.asura.security.JwtService;
import com.asura.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService,
                          JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam(defaultValue = "EMPLOYEE") String role) {

        User user = authService.registerUser(email, password, role);

        return ResponseEntity.ok(
                new UserResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest) {

        User user = authService.authenticateUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                )
        );
    }

    public static class LoginResponse {

        private String token;
        private Long id;
        private String email;
        private String role;

        public LoginResponse(String token,
                             Long id,
                             String email,
                             String role) {
            this.token = token;
            this.id = id;
            this.email = email;
            this.role = role;
        }

        public String getToken() {
            return token;
        }

        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }
    }
}