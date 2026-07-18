import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

const EMPLOYEES_COLLECTION = 'employees';

export const getEmployees = async () => {
  const querySnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION));
  return querySnapshot.docs.map(doc => ({
    _id: doc.id,
    ...doc.data()
  }));
};

export const getEmployee = async (id) => {
  const docRef = doc(db, EMPLOYEES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { _id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error('Employee not found');
  }
};

export const createEmployee = async (employeeData) => {
  const docRef = await addDoc(collection(db, EMPLOYEES_COLLECTION), {
    ...employeeData,
    createdAt: new Date().toISOString()
  });
  return { _id: docRef.id, ...employeeData };
};

export const updateEmployee = async (id, employeeData) => {
  const docRef = doc(db, EMPLOYEES_COLLECTION, id);
  await updateDoc(docRef, {
    ...employeeData,
    updatedAt: new Date().toISOString()
  });
  return { _id: id, ...employeeData };
};

export const deleteEmployee = async (id) => {
  const docRef = doc(db, EMPLOYEES_COLLECTION, id);
  await deleteDoc(docRef);
};
