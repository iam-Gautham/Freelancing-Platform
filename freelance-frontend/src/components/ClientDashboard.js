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
            alert('Job posted successfully!');
            setTitle('');
            setDescription('');
            setBudget('');
            fetchJobs(user.userId);
        } catch (error) {
            alert('Failed to post job.');
            console.error("Job post error:", error);
        }
    };

    const handleViewBids = async (jobId, jobTitle) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/jobs/${jobId}/bids`);
            const bids = response.data;
            if (bids.length === 0) {
                alert(`No bids have been placed for "${jobTitle}" yet.`);
                return;
            }
            let bidsText = `Bids for "${jobTitle}":\n\n`;
            bids.forEach(bid => {
                bidsText += `Freelancer: ${bid.freelancerUsername}\nAmount: $${bid.bidAmount}\nProposal: ${bid.proposal}\n-----------------\n`;
            });
            alert(bidsText);
        } catch (error) {
            alert("Could not fetch bids for this job.");
            console.error("Fetch bids error:", error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user.username} (Client)</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div className="form-container" style={{ margin: '2rem 0', maxWidth: '100%' }}>
                <h2>Post a New Job</h2>
                <form onSubmit={handlePostJob}>
                    <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <input type="number" placeholder="Budget (e.g., 500)" value={budget} onChange={(e) => setBudget(e.target.value)} required />
                    <button type="submit">Post Job</button>
                </form>
            </div>

            <h2>Your Posted Jobs</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Budget</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map(job => (
                        <tr key={job.jobId}>
                            <td>{job.title}</td>
                            <td>${job.budget}</td>
                            <td>{job.status}</td>
                            <td>
                                <button onClick={() => handleViewBids(job.jobId, job.title)}>View Bids</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientDashboard;