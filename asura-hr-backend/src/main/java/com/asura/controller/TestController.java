package com.asura.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test(Authentication authentication) {

        return "JWT authentication successful. Logged in as: "
                + authentication.getName()
                + " | Role: "
                + authentication.getAuthorities();
    }

    @GetMapping("/api/test/admin")
    public String adminTest(Authentication authentication) {

        return "HR_ADMIN access successful. Logged in as: "
                + authentication.getName();
    }

    @GetMapping("/api/test/manager")
    public String managerTest(Authentication authentication) {

        return "MANAGER access successful. Logged in as: "
                + authentication.getName();
    }

    @GetMapping("/api/test/employee")
    public String employeeTest(Authentication authentication) {

        return "EMPLOYEE access successful. Logged in as: "
                + authentication.getName();
    }
}