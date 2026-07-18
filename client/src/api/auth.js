import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const login = async (credentials) => {
  const { email, password } = credentials;
  // Note: Previous backend used username or email. We might need to adjust the UI to always use email.
  // Assuming the UI will pass email in the credentials.
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  // Fetch user role from Firestore
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  const userData = userDoc.exists() ? userDoc.data() : { role: 'User', username: email };
  
  return {
    _id: userCredential.user.uid,
    email: userCredential.user.email,
    ...userData
  };
};

export const register = async (userData) => {
  const { email, password, username, role } = userData;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  const newUser = {
    username,
    email,
    role: role || 'User',
    createdAt: new Date().toISOString()
  };

  // Store additional user data (like role) in Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), newUser);

  return {
    _id: userCredential.user.uid,
    ...newUser
  };
};

export const logout = async () => {
  await signOut(auth);
};

// getMe is mostly handled by onAuthStateChanged in the context now,
// but we can provide a helper to fetch user data if there's a current user.
export const getMe = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Not authenticated");
  
  const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
  const userData = userDoc.exists() ? userDoc.data() : { role: 'User', username: currentUser.email };
  
  return {
    _id: currentUser.uid,
    email: currentUser.email,
    ...userData
  };
};
