import { useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { UserProfile } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser) => {
    const { firestore } = initializeFirebase();
    try {
      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setUser({
          id: firebaseUser.uid,
          role: data.role,
          name: data.name,
          email: firebaseUser.email || data.email,
          phone: data.phone,
          dob: data.dob,
          address: data.address,
        });
      } else {
        console.warn("User document not found in Firestore for UID:", firebaseUser.uid);
        setUser({
          id: firebaseUser.uid,
          role: 'student',
          name: firebaseUser.displayName || 'Unknown User',
          email: firebaseUser.email || '',
          phone: '',
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const { auth } = initializeFirebase();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  const refreshUser = useCallback(async () => {
    const { auth } = initializeFirebase();
    const currentUser = auth.currentUser;
    if (currentUser) {
      await fetchUserProfile(currentUser);
    }
  }, [fetchUserProfile]);

  return { user, loading, refreshUser };
}
