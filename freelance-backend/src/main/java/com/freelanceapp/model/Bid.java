package com.freelanceapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bids")
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bidId;
    private Integer jobId;
    private Integer freelancerId;
    private Double bidAmount;
    private String proposal;

    public Integer getBidId() { return bidId; }
    public void setBidId(Integer bidId) { this.bidId = bidId; }
    public Integer getJobId() { return jobId; }
    public void setJobId(Integer jobId) { this.jobId = jobId; }
    public Integer getFreelancerId() { return freelancerId; }
    public void setFreelancerId(Integer freelancerId) { this.freelancerId = freelancerId; }
    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }
    public String getProposal() { return proposal; }
    public void setProposal(String proposal) { this.proposal = proposal; }
}