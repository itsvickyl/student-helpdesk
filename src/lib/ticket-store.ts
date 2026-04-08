import { Ticket } from './types';

const TICKETS_KEY = 'eduhelp_tickets';

const DEFAULT_TICKETS: Ticket[] = [
  {
    id: 't1',
    userId: 'student_1',
    userName: 'John Doe',
    title: 'Wi-Fi Connection Issue',
    description: 'The Wi-Fi in the Library is very slow and keeps disconnecting.',
    category: 'IT Support',
    status: 'Unsolved',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 't2',
    userId: 'student_1',
    userName: 'John Doe',
    title: 'Tuition Fee Clarification',
    description: 'I noticed a discrepancy in my semester bill regarding lab fees.',
    category: 'Billing',
    status: 'Solved',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    response: 'The lab fees were adjusted for the online course format. Your account has been updated.'
  }
];

export function getTickets(): Ticket[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(TICKETS_KEY);
  if (!stored) {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(DEFAULT_TICKETS));
    return DEFAULT_TICKETS;
  }
  return JSON.parse(stored);
}

export function saveTicket(ticket: Ticket) {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticket.id);
  if (index >= 0) {
    tickets[index] = ticket;
  } else {
    tickets.unshift(ticket);
  }
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

export function deleteTicket(id: string) {
  const tickets = getTickets().filter(t => t.id !== id);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}
