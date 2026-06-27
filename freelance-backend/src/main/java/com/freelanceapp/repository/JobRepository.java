package com.freelanceapp.repository;

import com.freelanceapp.model.Bid;
import com.freelanceapp.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByStatus(String status);
    List<Job> findByClientId(Integer clientId);
    List<Bid> findByJobId(Integer jobId);
}