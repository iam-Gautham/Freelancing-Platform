import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FreelancerDashboard = () => {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
        if (loggedInUser && loggedInUser.userType === 'freelancer') {
            setUser(loggedInUser);
            fetchJobs();
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
    
    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    const handleBid = async (job) => {
        const amount = prompt(`Enter your bid amount for "${job.title}":`);
        if (!amount || isNaN(amount)) {
            alert("Please enter a valid number for the bid amount.");
            return;
        }
        
        const proposal = prompt("Enter a brief proposal:");
        if (!proposal) {
            alert("Proposal cannot be empty.");
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/jobs/bid', {
                jobId: job.jobId,
                freelancerId: user.userId,
                amount: parseFloat(amount),
                proposal: proposal
            });
            alert('Bid placed successfully!');
        } catch (error) {
            alert('Failed to place bid. Please try again.');
            console.error("Bid submission error:", error);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <h1>Welcome, {user.username} (Freelancer)</h1>
            <button onClick={handleLogout}>Logout</button>
            <h2>Open Jobs</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Budget</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map(job => (
                        <tr key={job.jobId}>
                            <td>{job.title}</td>
                            <td>{job.description}</td>
                            <td>${job.budget}</td>
                            <td>
                                <button onClick={() => handleBid(job)}>Place Bid</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FreelancerDashboard;