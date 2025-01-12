// App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState(() => {
    // Try to get the saved groupBy from localStorage, default to 'status' if not found
    return localStorage.getItem('groupBy') || 'status';
  });
  const [sortBy, setSortBy] = useState(() => {
    // Try to get the saved sortBy from localStorage, default to 'priority' if not found
    return localStorage.getItem('sortBy') || 'priority';
  });

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Save groupBy to localStorage whenever it changes
    localStorage.setItem('groupBy', groupBy);
  }, [groupBy]);

  useEffect(() => {
    // Save sortBy to localStorage whenever it changes
    localStorage.setItem('sortBy', sortBy);
  }, [sortBy]);

  const handleGroupChange = (newGroupBy) => {
    setGroupBy(newGroupBy);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="App">
      <Header 
        groupBy={groupBy} 
        setGroupBy={handleGroupChange}
        sortBy={sortBy}
        setSortBy={handleSortChange}
      />
      <KanbanBoard 
        tickets={tickets}
        users={users}
        groupBy={groupBy}
        sortBy={sortBy}
      />
    </div>
  );
}

export default App;
