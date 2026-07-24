package com.freelanceapp.dto;

public class BidResponseDTO {
    private Integer bidId;
    private Integer freelancerId;
    private Double bidAmount;
    private String proposal;
    private String freelancerUsername;
    private String freelancerEmail;
    private String status;
    
    public Integer getBidId() { return bidId; }
    public void setBidId(Integer bidId) { this.bidId = bidId; }
    public Integer getFreelancerId() { return freelancerId; }
    public void setFreelancerId(Integer freelancerId) { this.freelancerId = freelancerId; }
    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }
    public String getProposal() { return proposal; }
    public void setProposal(String proposal) { this.proposal = proposal; }
    public String getFreelancerUsername() { return freelancerUsername; }
    public void setFreelancerUsername(String freelancerUsername) { this.freelancerUsername = freelancerUsername; }
    public String getFreelancerEmail() { return freelancerEmail; }
    public void setFreelancerEmail(String freelancerEmail) { this.freelancerEmail = freelancerEmail; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}