package com.freelanceapp.service;

import com.freelanceapp.dto.BidResponseDTO;
import com.freelanceapp.model.Bid;
import com.freelanceapp.model.Job;
import com.freelanceapp.repository.BidRepository;
import com.freelanceapp.repository.JobRepository;
import com.freelanceapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {
    @Autowired private JobRepository jobRepository;
    @Autowired private BidRepository bidRepository;
    @Autowired private UserRepository userRepository;

    public Job postJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> getOpenJobs() {
        return jobRepository.findByStatus("open");
    }

    public List<Job> getJobsByClientId(Integer id) {
        return jobRepository.findByClientId(id);
    }

    public Bid placeBid(Bid bid) {
        return bidRepository.save(bid);
    }

    public List<BidResponseDTO> getBidsByJobId(Integer jobId) {
        List<Bid> bids = bidRepository.findByJobId(jobId);
        
        return bids.stream().map(bid -> {
            BidResponseDTO dto = new BidResponseDTO();
            dto.setBidAmount(bid.getBidAmount());
            dto.setProposal(bid.getProposal());
            
            userRepository.findById(bid.getFreelancerId()).ifPresent(user -> {
                dto.setFreelancerUsername(user.getUsername());
            });
            
            return dto;
        }).collect(Collectors.toList());
    }
}