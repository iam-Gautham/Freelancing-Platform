package com.freelanceapp.dto;

public class FreelancerBidResponseDTO {
    private Integer bidId;
    private Integer jobId;
    private String jobTitle;
    private Double jobBudget;
    private Double bidAmount;
    private String proposal;
    private String status;

    public Integer getBidId() { return bidId; }
    public void setBidId(Integer bidId) { this.bidId = bidId; }
    public Integer getJobId() { return jobId; }
    public void setJobId(Integer jobId) { this.jobId = jobId; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public Double getJobBudget() { return jobBudget; }
    public void setJobBudget(Double jobBudget) { this.jobBudget = jobBudget; }
    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }
    public String getProposal() { return proposal; }
    public void setProposal(String proposal) { this.proposal = proposal; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
