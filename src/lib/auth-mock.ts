import { UserProfile } from './types';

// In a real app, this would use Firebase Auth and Firestore.
// For the prototype, we use a simple sessionStorage-based mock.

const STORAGE_KEY = 'eduhelp_session';

export function setSession(user: UserProfile) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

export function getSession(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const session = sessionStorage.getItem(STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  }
  return null;
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export const MOCK_ADMIN: UserProfile = {
  id: 'admin_1',
  role: 'admin',
  name: 'Registrar Office',
  email: 'admin@eduhelp.edu',
  phone: '9876543210'
};

export const MOCK_STUDENT: UserProfile = {
  id: 'student_1',
  role: 'student',
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  phone: '9887766554',
  dob: '2002-05-15',
  address: '123 University Lane, Building A, Room 402'
};
