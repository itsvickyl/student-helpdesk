import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { UserProfile } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { auth, firestore } = initializeFirebase();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Fetch additional user profile data from Firestore
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
            // Fallback for incomplete registration
            setUser({
              id: firebaseUser.uid,
              role: 'student', // Default fallback
              name: firebaseUser.displayName || 'Unknown User',
              email: firebaseUser.email || '',
              phone: '',
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
