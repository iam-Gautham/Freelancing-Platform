package com.freelanceapp.repository;

import java.util.List;

import com.freelanceapp.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<Bid, Integer> {
    List<Bid> findByJobId(Integer jobId);
    List<Bid> findByFreelancerId(Integer freelancerId);
}