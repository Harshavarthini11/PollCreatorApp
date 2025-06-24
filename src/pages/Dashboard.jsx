import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/polls')
      .then(res => res.json())
      .then(setPolls);
  }, []);

  return (
    <div className="container">
      <h2>All Polls</h2>
      <button onClick={() => navigate('/create')}>Create Poll</button>
      <ul>
        {polls.map(poll => (
          <li key={poll._id}>
            {poll.question}
            <button onClick={() => navigate(`/poll/${poll._id}`)}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;