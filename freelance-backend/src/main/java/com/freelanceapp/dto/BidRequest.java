// File: com/freelanceapp/dto/BidRequest.java
package com.freelanceapp.dto;

public class BidRequest {
    private Integer jobId;
    private Integer freelancerId;
    private Double amount;
    private String proposal;

    // Getters and Setters
    public Integer getJobId() { return jobId; }
    public void setJobId(Integer jobId) { this.jobId = jobId; }
    public Integer getFreelancerId() { return freelancerId; }
    public void setFreelancerId(Integer freelancerId) { this.freelancerId = freelancerId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getProposal() { return proposal; }
    public void setProposal(String proposal) { this.proposal = proposal; }
}