package com.freelanceapp.dto;

public class BidResponseDTO {
    private Double bidAmount;
    private String proposal;
    private String freelancerUsername;
    
    // Getters and Setters
    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }
    public String getProposal() { return proposal; }
    public void setProposal(String proposal) { this.proposal = proposal; }
    public String getFreelancerUsername() { return freelancerUsername; }
    public void setFreelancerUsername(String freelancerUsername) { this.freelancerUsername = freelancerUsername; }
}