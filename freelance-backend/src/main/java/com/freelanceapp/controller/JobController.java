// File: com/freelanceapp/controller/JobController.java
package com.freelanceapp.controller;

import com.freelanceapp.dto.BidRequest;
import com.freelanceapp.dto.BidResponseDTO;
import com.freelanceapp.dto.JobPostRequest;
import com.freelanceapp.model.Bid;
import com.freelanceapp.model.Job;
import com.freelanceapp.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @Autowired
    private JobService jobService;

    @PostMapping("/post")
    public ResponseEntity<Job> postJob(@RequestBody JobPostRequest req) {
        Job newJob = new Job();
        newJob.setClientId(req.getClientId());
        newJob.setTitle(req.getTitle());
        newJob.setDescription(req.getDescription());
        newJob.setBudget(req.getBudget());
        
        Job savedJob = jobService.postJob(newJob);
        return ResponseEntity.ok(savedJob);
    }

    @GetMapping("/open")
    public ResponseEntity<List<Job>> getOpenJobs() {
        List<Job> openJobs = jobService.getOpenJobs();
        return ResponseEntity.ok(openJobs);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Job>> getClientJobs(@PathVariable Integer clientId) {
        List<Job> clientJobs = jobService.getJobsByClientId(clientId);
        return ResponseEntity.ok(clientJobs);
    }
    
    @PostMapping("/bid")
    public ResponseEntity<Bid> placeBid(@RequestBody BidRequest req) {
        Bid newBid = new Bid();
        newBid.setJobId(req.getJobId());
        newBid.setFreelancerId(req.getFreelancerId());
        newBid.setBidAmount(req.getAmount());
        newBid.setProposal(req.getProposal());
        
        Bid savedBid = jobService.placeBid(newBid);
        return ResponseEntity.ok(savedBid);
    }

    // ✅ Added new method to fetch bids for a specific job
    @GetMapping("/{jobId}/bids")
    public ResponseEntity<List<BidResponseDTO>> getBidsForJob(@PathVariable Integer jobId) {
        return ResponseEntity.ok(jobService.getBidsByJobId(jobId));
    }
}
