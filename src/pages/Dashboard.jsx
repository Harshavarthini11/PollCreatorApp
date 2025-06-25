import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; 

function Dashboard() {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/polls')
      .then(res => res.json())
      .then(setPolls);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const getTotalVotes = (options) =>
    options.reduce((total, opt) => total + opt.votes, 0);

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>All Polls</h2>
        <div>
          <button onClick={() => navigate('/create')}>Create Poll</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="polls-grid">
        {polls.map(poll => (
          <div key={poll._id} className="poll-card">
            <h3>{poll.question}</h3>
            <p>Total Votes: {getTotalVotes(poll.options)}</p>
            <button onClick={() => navigate(`/poll/${poll._id}`)}>View Poll</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
