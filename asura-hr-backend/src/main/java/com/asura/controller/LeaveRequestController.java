
package com.asura.controller;

import com.asura.entity.LeaveRequest;
import com.asura.service.LeaveRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    private final LeaveRequestService service;

    public LeaveRequestController(LeaveRequestService service) {
        this.service = service;
    }

    @GetMapping
    public List<LeaveRequest> getRequests(Authentication authentication) {
        String email = authentication.getName();
        String role = getRole(authentication);

        return service.getRequests(email, role);
    }

    @PostMapping
    public ResponseEntity<?> apply(
            Authentication authentication,
            @RequestBody LeaveRequest request
    ) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(service.apply(authentication.getName(), request));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", exception.getMessage()));
        }
    }

    @PutMapping("/{id}/decision")
    public ResponseEntity<?> decide(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody Map<String, String> body
    ) {
        try {
            LeaveRequest updated = service.decide(
                    id,
                    authentication.getName(),
                    getRole(authentication),
                    body.get("decision"),
                    body.get("note")
            );

            return ResponseEntity.ok(updated);
        } catch (SecurityException exception) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", exception.getMessage()));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", exception.getMessage()));
        }
    }

    private String getRole(Authentication authentication) {
        return authentication.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring(5))
                .findFirst()
                .orElse("");
    }
}
