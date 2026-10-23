
package com.asura.service;

import com.asura.entity.LeaveRequest;
import com.asura.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class LeaveRequestService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "ANNUAL",
            "SICK",
            "UNPAID",
            "COMPASSIONATE",
            "OTHER"
    );

    private final LeaveRequestRepository repository;

    public LeaveRequestService(LeaveRequestRepository repository) {
        this.repository = repository;
    }

    public List<LeaveRequest> getRequests(String email, String role) {
        if (isApprover(role)) {
            return repository.findAllByOrderByStartDateDesc();
        }

        return repository.findByEmployeeEmailOrderByStartDateDesc(email);
    }

    @Transactional
    public LeaveRequest apply(String email, LeaveRequest request) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Your account email could not be identified.");
        }

        if (request.getLeaveType() == null
                || !ALLOWED_TYPES.contains(request.getLeaveType().toUpperCase())) {
            throw new IllegalArgumentException("Select a valid leave type.");
        }

        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("Start date and end date are required.");
        }

        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Leave cannot start in the past.");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before the start date.");
        }

        if (request.getReason() == null || request.getReason().isBlank()) {
            throw new IllegalArgumentException("Please provide a reason for your leave.");
        }

        if (request.getReason().trim().length() > 1000) {
            throw new IllegalArgumentException("The reason must be 1000 characters or fewer.");
        }

        LeaveRequest saved = new LeaveRequest();
        saved.setEmployeeEmail(email);
        saved.setLeaveType(request.getLeaveType().toUpperCase());
        saved.setStartDate(request.getStartDate());
        saved.setEndDate(request.getEndDate());
        saved.setReason(request.getReason().trim());
        saved.setStatus("PENDING");

        return repository.save(saved);
    }

    @Transactional
    public LeaveRequest decide(
            Long id,
            String reviewerEmail,
            String role,
            String decision,
            String note
    ) {
        if (!isApprover(role)) {
            throw new SecurityException("You are not allowed to review leave requests.");
        }

        String normalisedDecision = decision == null
                ? ""
                : decision.trim().toUpperCase();

        if (!Set.of("APPROVED", "REJECTED").contains(normalisedDecision)) {
            throw new IllegalArgumentException("Decision must be APPROVED or REJECTED.");
        }

        LeaveRequest request = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found."));

        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalArgumentException("This leave request has already been reviewed.");
        }

        request.setStatus(normalisedDecision);
        request.setReviewedBy(reviewerEmail);
        request.setReviewedAt(LocalDateTime.now());
        request.setDecisionNote(note == null ? null : note.trim());

        return repository.save(request);
    }

    private boolean isApprover(String role) {
        return "HR_ADMIN".equalsIgnoreCase(role)
                || "MANAGER".equalsIgnoreCase(role);
    }
}
