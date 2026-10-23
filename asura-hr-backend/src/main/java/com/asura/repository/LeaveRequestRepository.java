
package com.asura.repository;

import com.asura.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findAllByOrderByStartDateDesc();

    List<LeaveRequest> findByEmployeeEmailOrderByStartDateDesc(
            String employeeEmail
    );
}
