package com.asura.service;

import com.asura.entity.Employee;
import com.asura.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {


    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Get all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Get employee by ID
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));
    }

    // Add employee
    public Employee createEmployee(Employee employee) {

        if (employee.getEmail() != null) {
            employee.setEmail(
                    employee.getEmail().trim().toLowerCase()
            );
        }

        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException(
                    "Email address already exists. Please use a different email address."
            );
        }

        validatePhoneNumber(employee.getPhone());

        validateJobTitle(employee.getJobTitle());

        validateJobDescription(employee.getJobDescription());

        return employeeRepository.save(employee);
    }

    // Update employee
    public Employee updateEmployee(Long id, Employee updatedEmployee) {

        Employee existingEmployee = getEmployeeById(id);

        if (updatedEmployee.getEmail() != null) {

            String updatedEmail =
                    updatedEmployee.getEmail().trim().toLowerCase();

            if (!updatedEmail.equalsIgnoreCase(existingEmployee.getEmail())
                    && employeeRepository.existsByEmail(updatedEmail)) {

                throw new RuntimeException(
                        "Email address already exists. Please use a different email address."
                );
            }

            existingEmployee.setEmail(updatedEmail);
        }

        validatePhoneNumber(updatedEmployee.getPhone());

        validateJobTitle(updatedEmployee.getJobTitle());

        validateJobDescription(
                updatedEmployee.getJobDescription()
        );

        existingEmployee.setFirstName(
                updatedEmployee.getFirstName()
        );

        existingEmployee.setLastName(
                updatedEmployee.getLastName()
        );

        existingEmployee.setPhone(
                updatedEmployee.getPhone()
        );

        existingEmployee.setDepartment(
                updatedEmployee.getDepartment()
        );

        existingEmployee.setJobTitle(
                updatedEmployee.getJobTitle()
        );

        existingEmployee.setJobDescription(
                updatedEmployee.getJobDescription()
        );

        existingEmployee.setRole(
                updatedEmployee.getRole()
        );

        existingEmployee.setJoiningDate(
                updatedEmployee.getJoiningDate()
        );

        existingEmployee.setEmploymentStatus(
                updatedEmployee.getEmploymentStatus()
        );

        return employeeRepository.save(existingEmployee);
    }

    // Delete employee
    public void deleteEmployee(Long id) {

        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found");
        }

        employeeRepository.deleteById(id);
    }

    // Validate phone number
    private void validatePhoneNumber(String phone) {

        if (phone == null || phone.trim().isEmpty()) {
            throw new RuntimeException(
                    "Phone number is required."
            );
        }

        String cleanedPhone = phone.trim();

        if (!cleanedPhone.matches(
                "^\\+?[0-9][0-9\\s()-]*$"
        )) {
            throw new RuntimeException(
                    "Phone number can contain only numbers, spaces, +, hyphens and brackets."
            );
        }

        String digitsOnly =
                cleanedPhone.replaceAll("\\D", "");

        if (digitsOnly.length() < 9 ||
                digitsOnly.length() > 15) {

            throw new RuntimeException(
                    "Phone number must contain between 9 and 15 digits."
            );
        }

        if (digitsOnly.matches("^(\\d)\\1+$")) {

            throw new RuntimeException(
                    "Please enter a valid phone number."
            );
        }

        if (digitsOnly.equals("1234567890")) {

            throw new RuntimeException(
                    "Please enter a valid phone number."
            );
        }
    }

    // Validate job title
    private void validateJobTitle(String jobTitle) {

        if (jobTitle == null || jobTitle.trim().isEmpty()) {
            throw new RuntimeException(
                    "Job title is required."
            );
        }

        String cleanedJobTitle = jobTitle.trim();

        if (!cleanedJobTitle.matches(
                ".*[A-Za-zÀ-ÿ].*"
        )) {
            throw new RuntimeException(
                    "Please enter a valid job title."
            );
        }

        if (!cleanedJobTitle.matches(
                "[A-Za-zÀ-ÿ0-9 '&/().,-]+"
        )) {
            throw new RuntimeException(
                    "Please enter a valid job title."
            );
        }
    }

    // Validate job description
    private void validateJobDescription(String jobDescription) {

        if (jobDescription == null ||
                jobDescription.trim().isEmpty()) {

            throw new RuntimeException(
                    "Job description is required."
            );
        }

        String cleanedJobDescription =
                jobDescription.trim();

        if (!cleanedJobDescription.matches(
                ".*[A-Za-zÀ-ÿ].*"
        )) {
            throw new RuntimeException(
                    "Please enter a valid job description."
            );
        }

        if (!cleanedJobDescription.matches(
                "[A-Za-zÀ-ÿ0-9 '&/().,\\-]+"
        )) {
            throw new RuntimeException(
                    "Please enter a valid job description."
            );
        }
    }


}
