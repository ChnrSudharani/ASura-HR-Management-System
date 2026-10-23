package com.asura.service;

import com.asura.entity.User;
import com.asura.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(
            String email,
            String password,
            String role) {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException(
                    "Email address already exists"
            );
        }

        User user = new User(
                email,
                passwordEncoder.encode(password),
                role
        );

        return userRepository.save(user);
    }

    public User authenticateUser(
            String email,
            String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                password, user.getPassword())) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return user;
    }

    public void resetPasswordByEmail(
            String email,
            String newPassword) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "Email address is required."
            );
        }

        if (newPassword == null
                || newPassword.length() < 8) {
            throw new IllegalArgumentException(
                    "New password must contain at least 8 characters."
            );
        }

        User user = userRepository
                .findByEmailIgnoreCase(email.trim())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No account was found for that email address."
                        )
                );

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);
    }
}