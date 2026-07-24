package com.freelanceapp.service;

import com.freelanceapp.dto.BidResponseDTO;
import com.freelanceapp.dto.FreelancerBidResponseDTO;
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
            dto.setBidId(bid.getBidId());
            dto.setFreelancerId(bid.getFreelancerId());
            dto.setBidAmount(bid.getBidAmount());
            dto.setProposal(bid.getProposal());
            dto.setStatus(bid.getStatus());
            
            userRepository.findById(bid.getFreelancerId()).ifPresent(user -> {
                dto.setFreelancerUsername(user.getUsername());
                dto.setFreelancerEmail(user.getEmail());
            });
            
            return dto;
        }).collect(Collectors.toList());
    }

    public List<FreelancerBidResponseDTO> getBidsByFreelancerId(Integer freelancerId) {
        List<Bid> bids = bidRepository.findByFreelancerId(freelancerId);
        
        return bids.stream().map(bid -> {
            FreelancerBidResponseDTO dto = new FreelancerBidResponseDTO();
            dto.setBidId(bid.getBidId());
            dto.setJobId(bid.getJobId());
            dto.setBidAmount(bid.getBidAmount());
            dto.setProposal(bid.getProposal());
            dto.setStatus(bid.getStatus());
            
            jobRepository.findById(bid.getJobId()).ifPresent(job -> {
                dto.setJobTitle(job.getTitle());
                dto.setJobBudget(job.getBudget());
            });
            
            return dto;
        }).collect(Collectors.toList());
    }

    public void acceptBid(Integer bidId) {
        Bid acceptedBid = bidRepository.findById(bidId)
            .orElseThrow(() -> new IllegalArgumentException("Bid not found"));
        
        acceptedBid.setStatus("accepted");
        bidRepository.save(acceptedBid);
        
        // Update job status to closed
        jobRepository.findById(acceptedBid.getJobId()).ifPresent(job -> {
            job.setStatus("closed");
            jobRepository.save(job);
        });
        
        // Reject all other bids for this job
        List<Bid> otherBids = bidRepository.findByJobId(acceptedBid.getJobId());
        for (Bid bid : otherBids) {
            if (!bid.getBidId().equals(bidId)) {
                bid.setStatus("rejected");
                bidRepository.save(bid);
            }
        }
    }
}