import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClientDashboard = () => {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    
    // Modal states
    const [selectedJob, setSelectedJob] = useState(null);
    const [bids, setBids] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');

    useEffect(() => {
        const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
        if (loggedInUser && loggedInUser.userType === 'client') {
            setUser(loggedInUser);
            fetchJobs(loggedInUser.userId);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchJobs = async (clientId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/jobs/client/${clientId}`);
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        if (!title || !description || !budget) {
            alert("Please fill all fields.");
            return;
        }
        try {
            await axios.post('http://localhost:8080/api/jobs/post', {
                clientId: user.userId,
                title: title,
                description: description,
                budget: parseFloat(budget)
            });
            setTitle('');
            setDescription('');
            setBudget('');
            fetchJobs(user.userId);
        } catch (error) {
            alert('Failed to post job.');
            console.error("Job post error:", error);
        }
    };

    const handleOpenBidsModal = async (job) => {
        setSelectedJob(job);
        setModalOpen(true);
        setModalError('');
        setModalSuccess('');
        setBids([]);
        try {
            const response = await axios.get(`http://localhost:8080/api/jobs/${job.jobId}/bids`);
            setBids(response.data);
        } catch (error) {
            setModalError("Could not fetch bids for this job.");
            console.error("Fetch bids error:", error);
        }
    };

    const handleAcceptBid = async (bid) => {
        if (!window.confirm(`Are you sure you want to accept the bid from ${bid.freelancerUsername} for $${bid.bidAmount}? This will close the job.`)) {
            return;
        }
        setModalError('');
        setModalSuccess('');
        try {
            await axios.post(`http://localhost:8080/api/jobs/bids/${bid.bidId}/accept`);
            setModalSuccess(`Successfully accepted bid by ${bid.freelancerUsername}!`);
            
            // Refresh bids modal list
            const response = await axios.get(`http://localhost:8080/api/jobs/${selectedJob.jobId}/bids`);
            setBids(response.data);

            // Update local selected job status to closed
            setSelectedJob(prev => ({ ...prev, status: 'closed' }));
            
            // Refresh main dashboard list
            fetchJobs(user.userId);
        } catch (error) {
            setModalError("Failed to accept bid. Please try again.");
            console.error("Accept bid error:", error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Loading...</div>;
    }

    // Dashboard calculations
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'open').length;
    const closedJobs = jobs.filter(j => j.status === 'closed').length;
    const totalBudget = jobs.reduce((sum, j) => sum + j.budget, 0);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h2>Client Console</h2>
                    <p style={{ margin: 0, textAlign: 'left', fontSize: '0.9rem' }}>Logged in as: <strong style={{ color: 'var(--primary-color)' }}>{user.username}</strong></p>
                </div>
                <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            {/* Statistics */}
            <div className="stats-panel">
                <div className="stat-card">
                    <div className="stat-icon">💼</div>
                    <div className="stat-info">
                        <span className="stat-value">{totalJobs}</span>
                        <span className="stat-label">Total Posted</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-info">
                        <span className="stat-value">{activeJobs}</span>
                        <span className="stat-label">Active Openings</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔒</div>
                    <div className="stat-info">
                        <span className="stat-value">{closedJobs}</span>
                        <span className="stat-label">Closed & Filled</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💵</div>
                    <div className="stat-info">
                        <span className="stat-value">${totalBudget.toLocaleString()}</span>
                        <span className="stat-label">Total Budget</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid client-grid">
                {/* Post job form */}
                <div className="section-card">
                    <h3>Post a New Job</h3>
                    <form onSubmit={handlePostJob}>
                        <div className="flex-column">
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Job Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. React Native Mobile App Development" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="flex-column">
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Description & Scope</label>
                            <textarea 
                                placeholder="Explain the project milestones, tech stack, and deliverable expectations..." 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="flex-column">
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Budget ($ USD)</label>
                            <input 
                                type="number" 
                                placeholder="e.g. 1200" 
                                value={budget} 
                                onChange={(e) => setBudget(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit">Broadcast Job Posting</button>
                    </form>
                </div>

                {/* Posted jobs table */}
                <div className="section-card">
                    <h3>Your Active & Previous Jobs</h3>
                    {jobs.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem' }}>You haven't posted any jobs yet. Use the form to start!</p>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Project Title</th>
                                        <th>Budget</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map(job => (
                                        <tr key={job.jobId}>
                                            <td style={{ fontWeight: '500' }}>{job.title}</td>
                                            <td style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>${job.budget}</td>
                                            <td>
                                                <span className={`badge badge-${job.status}`}>
                                                    {job.status === 'open' ? 'Open' : 'Closed'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button 
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} 
                                                    onClick={() => handleOpenBidsModal(job)}
                                                >
                                                    View Bids
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom View Bids Modal */}
            {modalOpen && selectedJob && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h3 style={{ margin: 0 }}>Review Bids</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0', textAlign: 'left' }}>
                                    For: <strong>{selectedJob.title}</strong>
                                </p>
                            </div>
                            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>×</button>
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

                        <div style={{ marginTop: '1rem' }}>
                            {bids.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                                    No proposals have been submitted for this job yet.
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {bids.map(bid => (
                                        <div 
                                            key={bid.bidId} 
                                            className={`modal-bid-item ${bid.status === 'accepted' ? 'accepted-bid' : ''}`}
                                        >
                                            <div className="modal-bid-header">
                                                <div>
                                                    <span className="modal-bid-freelancer">{bid.freelancerUsername}</span>
                                                    <span style={{ 
                                                        fontSize: '0.8rem', 
                                                        color: 'var(--text-muted)', 
                                                        marginLeft: '0.5rem',
                                                        display: 'block' 
                                                    }}>
                                                        ✉ {bid.freelancerEmail || 'No email shared'}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <span className="modal-bid-amount">${bid.bidAmount}</span>
                                                    <span className={`badge badge-${bid.status}`}>{bid.status}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="modal-bid-proposal">
                                                <strong>Proposal:</strong><br />
                                                {bid.proposal}
                                            </div>

                                            {selectedJob.status === 'open' && bid.status === 'pending' && (
                                                <button 
                                                    onClick={() => handleAcceptBid(bid)}
                                                    style={{ 
                                                        alignSelf: 'flex-end', 
                                                        padding: '0.45rem 1rem', 
                                                        fontSize: '0.85rem',
                                                        background: 'var(--success-color)',
                                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                                                        marginTop: '0.5rem'
                                                    }}
                                                >
                                                    Accept & Close Job
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;