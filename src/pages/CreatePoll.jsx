import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ question, options })
    });
    if (res.ok) {
      navigate('/dashboard');
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div className="container">
      <h2>Create Poll</h2>
      <input placeholder="Question" onChange={e => setQuestion(e.target.value)} />
      {options.map((opt, idx) => (
        <input key={idx} placeholder={`Option ${idx + 1}`} value={opt} onChange={e => {
          const newOptions = [...options];
          newOptions[idx] = e.target.value;
          setOptions(newOptions);
        }} />
      ))}
      <button onClick={() => setOptions([...options, ''])} disabled={options.length >= 4}>Add Option</button>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default CreatePoll;