import React, { useMemo, useState, useEffect } from "react";
import Column from "./column";
import "./KanbanBoard.css";

function KanbanBoard({ tickets, users, groupBy, sortBy }) {
  const [ticketList, setTicketList] = useState(tickets);

  // Sync ticketList with localStorage
  useEffect(() => {
    const savedTickets = localStorage.getItem("kanban_tickets");
    if (savedTickets) {
      setTicketList(JSON.parse(savedTickets));
    } else {
      setTicketList(tickets);
    }
  }, [tickets]); // Re-run when tickets prop changes

  const handleTicketMove = (ticketId, newGroup) => {
    setTicketList((prevTickets) => {
      const updatedTickets = prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, [groupBy]: newGroup } : ticket
      );
      // Save to localStorage
      localStorage.setItem("kanban_tickets", JSON.stringify(updatedTickets));
      return updatedTickets;
    });
  };

  const groupedAndSortedTickets = useMemo(() => {
    const grouped = ticketList.reduce((acc, ticket) => {
      const key = groupBy === "user" ? ticket.userId : ticket[groupBy];
      if (!acc[key]) acc[key] = [];
      acc[key].push(ticket);
      return acc;
    }, {});

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        if (sortBy === "priority") return b.priority - a.priority;
        return a.title.localeCompare(b.title);
      });
    });

    return grouped;
  }, [ticketList, groupBy, sortBy]);

  return (
    <div className="kanban-board">
      {Object.entries(groupedAndSortedTickets).map(([key, ticketsGroup]) => (
        <Column
          key={key}
          title={key}
          tickets={ticketsGroup}
          users={users}
          groupBy={groupBy}
          onTicketMove={handleTicketMove}
        />
      ))}
    </div>
  );
}

export default KanbanBoard;
