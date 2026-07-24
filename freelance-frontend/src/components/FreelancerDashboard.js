import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FreelancerDashboard = () => {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const navigate = useNavigate();

    // Search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [minBudget, setMinBudget] = useState('');

    // Bid modal states
    const [bidJob, setBidJob] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [proposal, setProposal] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
        if (loggedInUser && loggedInUser.userType === 'freelancer') {
            setUser(loggedInUser);
            fetchJobs();
            fetchMyBids(loggedInUser.userId);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/jobs/open`);
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        }
    };

    const fetchMyBids = async (freelancerId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/jobs/freelancer/${freelancerId}/bids`);
            setMyBids(response.data);
        } catch (error) {
            console.error("Failed to fetch freelancer bids:", error);
        }
    };
    
    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    const handleOpenBidModal = (job) => {
        setBidJob(job);
        setBidAmount('');
        setProposal('');
        setModalOpen(true);
        setModalError('');
        setModalSuccess('');
    };

    const handleCloseBidModal = () => {
        setModalOpen(false);
        setBidJob(null);
    };

    const handleSubmitBid = async (e) => {
        e.preventDefault();
        if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
            setModalError("Please enter a valid positive number for the bid amount.");
            return;
        }
        if (!proposal.trim()) {
            setModalError("Proposal cannot be empty.");
            return;
        }

        setSubmitting(true);
        setModalError('');
        setModalSuccess('');

        try {
            await axios.post('http://localhost:8080/api/jobs/bid', {
                jobId: bidJob.jobId,
                freelancerId: user.userId,
                amount: parseFloat(bidAmount),
                proposal: proposal
            });
            
            setModalSuccess('Bid placed successfully!');
            fetchMyBids(user.userId);
            
            setTimeout(() => {
                handleCloseBidModal();
            }, 1500);
        } catch (error) {
            setModalError('Failed to place bid. Please try again.');
            console.error("Bid submission error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Loading...</div>;

    // Filters logic
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBudget = minBudget === '' || job.budget >= parseFloat(minBudget);
        return matchesSearch && matchesBudget;
    });

    // Statistics panel calculation
    const totalBids = myBids.length;
    const wonBids = myBids.filter(b => b.status === 'accepted').length;
    const activeProposals = myBids.filter(b => b.status === 'pending').length;
    const highestProposal = myBids.reduce((max, b) => b.bidAmount > max ? b.bidAmount : max, 0);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h2>Freelancer Workspace</h2>
                    <p style={{ margin: 0, textAlign: 'left', fontSize: '0.9rem' }}>Logged in as: <strong style={{ color: 'var(--secondary-color)' }}>{user.username}</strong></p>
                </div>
                <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            {/* Stats Panel */}
            <div className="stats-panel">
                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-info">
                        <span className="stat-value">{totalBids}</span>
                        <span className="stat-label">Total Bids Placed</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🕒</div>
                    <div className="stat-info">
                        <span className="stat-value">{activeProposals}</span>
                        <span className="stat-label">Active Proposals</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-info">
                        <span className="stat-value">{wonBids}</span>
                        <span className="stat-label">Projects Won</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <span className="stat-value">${highestProposal.toLocaleString()}</span>
                        <span className="stat-label">Highest Bid</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
                
                {/* Browsing Open Jobs */}
                <div className="section-card">
                    <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                        Browse Open Opportunities
                    </h3>
                    
                    {/* Search and Filters */}
                    <div className="filter-bar">
                        <input 
                            className="filter-search"
                            type="text" 
                            placeholder="🔍 Search by keyword (React, backend, API, design...)" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <input 
                            className="filter-budget"
                            type="number" 
                            placeholder="💲 Min Budget ($)" 
                            value={minBudget}
                            onChange={(e) => setMinBudget(e.target.value)}
                        />
                    </div>

                    {filteredJobs.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            No open jobs matched your search criteria.
                        </p>
                    ) : (
                        <div className="jobs-list">
                            {filteredJobs.map(job => (
                                <div key={job.jobId} className="job-card">
                                    <div>
                                        <div className="job-card-header">
                                            <h4 className="job-card-title">{job.title}</h4>
                                        </div>
                                        <p className="job-card-desc">
                                            {job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}
                                        </p>
                                    </div>
                                    <div className="job-card-footer">
                                        <span className="job-budget-badge">${job.budget}</span>
                                        <button 
                                            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                                            onClick={() => handleOpenBidModal(job)}
                                        >
                                            Place Proposal
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Freelancer's Own Bids Tracker */}
                <div className="section-card">
                    <h3>My Submitted Proposals</h3>
                    {myBids.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            You haven't submitted any proposals yet. Find open jobs above and place a bid!
                        </p>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Project Title</th>
                                        <th>Project Budget</th>
                                        <th>Your Proposal Bid</th>
                                        <th>Proposal Text</th>
                                        <th>Bid Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myBids.map(bid => (
                                        <tr key={bid.bidId}>
                                            <td style={{ fontWeight: '500' }}>{bid.jobTitle || `Job #${bid.jobId}`}</td>
                                            <td style={{ color: 'var(--text-muted)' }}>${bid.jobBudget}</td>
                                            <td style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>${bid.bidAmount}</td>
                                            <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                                                {bid.proposal}
                                            </td>
                                            <td>
                                                <span className={`badge badge-${bid.status}`}>{bid.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {/* Custom Bid Proposal Submission Modal */}
            {modalOpen && bidJob && (
                <div className="modal-overlay" onClick={handleCloseBidModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h3 style={{ margin: 0 }}>Place a Bid Proposal</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0', textAlign: 'left' }}>
                                    For: <strong>{bidJob.title}</strong> (Client Budget: ${bidJob.budget})
                                </p>
                            </div>
                            <button className="modal-close-btn" onClick={handleCloseBidModal}>×</button>
                        </div>

                        {modalError && (
                            <div style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid var(--danger-color)',
                                color: '#fca5a5',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                marginBottom: '1.25rem',
                                fontSize: '0.9rem'
                            }}>
                                {modalError}
                            </div>
                        )}

                        {modalSuccess && (
                            <div style={{
                                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid var(--success-color)',
                                color: '#a7f3d0',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                marginBottom: '1.25rem',
                                fontSize: '0.9rem'
                            }}>
                                {modalSuccess}
                            </div>
                        )}

                        <form onSubmit={handleSubmitBid} style={{ marginTop: '1rem' }}>
                            <div className="flex-column">
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Bid Amount ($ USD)</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter your proposed rate..." 
                                    value={bidAmount} 
                                    onChange={(e) => setBidAmount(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="flex-column">
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Proposal Details</label>
                                <textarea 
                                    placeholder="Briefly state your relevant experience and how you plan to complete this job..." 
                                    value={proposal} 
                                    onChange={(e) => setProposal(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn-secondary" onClick={handleCloseBidModal}>Cancel</button>
                                <button type="submit" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Proposal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FreelancerDashboard;