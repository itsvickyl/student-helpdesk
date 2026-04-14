import { Ticket } from './types';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot, query, where, orderBy, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export async function saveTicket(ticket: Ticket) {
  const { firestore } = initializeFirebase();
  const ticketRef = doc(firestore, 'tickets', ticket.id);
  await setDoc(ticketRef, ticket, { merge: true });
}

export async function deleteTicket(id: string) {
  const { firestore } = initializeFirebase();
  const ticketRef = doc(firestore, 'tickets', id);
  await deleteDoc(ticketRef);
}

// Subscribe to all tickets for admins (real-time)
export function subscribeToAllTickets(callback: (tickets: Ticket[]) => void) {
  const { firestore } = initializeFirebase();
  const q = query(collection(firestore, 'tickets'));
  
  return onSnapshot(q, (snapshot) => {
    const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
    callback(tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });
}

// Subscribe to specific user tickets (real-time)
export function subscribeToUserTickets(userId: string, callback: (tickets: Ticket[]) => void) {
  const { firestore } = initializeFirebase();
  const q = query(collection(firestore, 'tickets'), where('userId', '==', userId));
  
  return onSnapshot(q, (snapshot) => {
    const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
    callback(tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });
}

