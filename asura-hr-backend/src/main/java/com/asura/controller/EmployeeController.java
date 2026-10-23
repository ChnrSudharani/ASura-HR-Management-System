
package com.asura.controller;

import com.asura.entity.Employee;
import com.asura.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Get all employees: HR_ADMIN and MANAGER
    @GetMapping
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'MANAGER')")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(
                employeeService.getAllEmployees()
        );
    }

    // Get employee by ID: HR_ADMIN and MANAGER
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'MANAGER')")
    public ResponseEntity<Employee> getEmployeeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                employeeService.getEmployeeById(id)
        );
    }

    // Add employee: HR_ADMIN and MANAGER
    @PostMapping
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'MANAGER')")
    public ResponseEntity<?> createEmployee(
            @RequestBody Employee employee) {

        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(employeeService.createEmployee(employee));

        } catch (RuntimeException e) {

            String message = e.getMessage();

            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Unable to create employee.");
            }

            String lowerCaseMessage = message.toLowerCase();

            // Duplicate email
            if (lowerCaseMessage.contains(
                    "email address already exists")) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(message);
            }

            // Phone validation
            if (lowerCaseMessage.contains("phone number")) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(message);
            }

            // Job title validation
            if (lowerCaseMessage.contains("job title")) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(message);
            }

            // Job description validation
            if (lowerCaseMessage.contains("job description")) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(message);
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Unable to create employee.");
        }
    }

    // Update employee: HR_ADMIN and MANAGER
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'MANAGER')")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        return ResponseEntity.ok(
                employeeService.updateEmployee(id, employee)
        );
    }

    // Delete employee: HR_ADMIN and MANAGER
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'MANAGER')")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable Long id) {

        employeeService.deleteEmployee(id);

        return ResponseEntity.ok(
                "Employee deleted successfully"
        );
    }
}
