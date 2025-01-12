import React from 'react';
import Ticket from './Ticket';
import './Column.css';
import addIcon from '../icons/add.svg';
import threeDot from '../icons/3 dot menu.svg';
import { getStatusIcon, getPriorityIcon } from '../utils/iconHelpers';

function Column({ title, tickets, users, groupBy, onTicketMove }) {
  const getColumnIcon = () => {
    if (groupBy === 'status') return getStatusIcon(title);
    if (groupBy === 'priority') return getPriorityIcon(parseInt(title));
    if (groupBy === 'user') {
      const user = users.find(u => u.id === title);
      if (user) {
        return (
          <div className={`user-avatar ${user.available ? 'available' : 'unavailable'}`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        );
      }
    }
    return null;
  };

  const getColumnTitle = () => {
    if (groupBy === 'user') {
      const user = users.find(u => u.id === title);
      return user ? user.name : title;
    }
    if (groupBy === 'priority') {
      const priorityMap = {
        4: 'Urgent',
        3: 'High',
        2: 'Medium',
        1: 'Low',
        0: 'No priority'
      };
      return priorityMap[title] || title;
    }
    return title;
  };

  const handleTicketSelection = (ticketId, isSelected) => {
    if (isSelected && title !== 'Done') {
      onTicketMove(ticketId, 'Done');
    } else if (!isSelected && title === 'Done') {
      onTicketMove(ticketId, 'To Do'); // Or the original column, if you're tracking that
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId) {
      onTicketMove(ticketId, title);
    }
  };

  return (
    <div 
      className="column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title">
          {getColumnIcon()}
          <span>{getColumnTitle()}</span>
          <span className="ticket-count">{tickets.length}</span>
        </div>
        <div className="column-actions">
          <img src={addIcon} alt="Add" className="add-icon" />
          <img src={threeDot} alt="Dots" className="dots-icon" />
        </div>
      </div>
      <div className="ticket-list">
        {tickets.map(ticket => (
          <Ticket 
            key={ticket.id} 
            ticket={ticket} 
            user={users.find(u => u.id === ticket.userId)}
            onSelectionChange={(isSelected) => handleTicketSelection(ticket.id, isSelected)}
          />
        ))}
      </div>
    </div>
  );
}

export default Column;