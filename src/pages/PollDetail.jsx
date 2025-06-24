import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/polls`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id === id);
        setPoll(found);
        const token = localStorage.getItem('token');
        if (found.voters.includes(JSON.parse(atob(token.split('.')[1])).id)) {
          setVoted(true);
        }
      });
  }, [id]);

  const handleVote = async (index) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/polls/vote/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ optionIndex: index })
    });
    const data = await res.json();
    setPoll(data);
    setVoted(true);
  };

  if (!poll) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{poll.question}</h2>
      {poll.options.map((opt, idx) => (
        <div key={idx} className="poll-option">
          <button onClick={() => handleVote(idx)} disabled={voted}>{opt.text}</button>
          {voted && <span> - Votes: {opt.votes}</span>}
        </div>
      ))}
    </div>
  );
}

export default PollDetail;
