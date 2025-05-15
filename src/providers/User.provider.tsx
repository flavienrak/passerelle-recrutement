import React from 'react';

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserInterface } from '../interfaces/User.interface';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { CvInterface } from '../interfaces/Cv.interface';
import { InterviewInterface } from '../interfaces/Interview.interface';
import { updateUserReducer } from '../redux/slices/user.slice';

interface UserContextType {
  isLoading: boolean;
  userData: UserInterface;
  updateUserData: (data: Partial<UserInterface>) => Promise<void>;
  resetUserData: () => void;
}

const initialUserData: UserInterface = {
  name: '',
  email: '',
  completedSteps: {
    cvUploaded: false,
    prequalificationCompleted: false,
    interviewCompleted: false,
    testStarted: false,
    testCompleted: false,
    receivedResults: false,
    completedFormation: false,
  },
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email } = useSelector((state: RootState) => state.persistInfos);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] =
    React.useState<UserInterface>(initialUserData);
  const [isLoading, setIsLoading] = React.useState(true);

  const notProtectedPaths = ['/cv-upload'];

  React.useEffect(() => {
    if (!email && !notProtectedPaths.includes(location.pathname)) {
      setIsLoading(false);
      navigate('/');
    } else {
      (async () => {
        setIsLoading(true);
        const interviewsDocRef = doc(db, 'interviews', email);
        const interviewsDocSnap = await getDoc(interviewsDocRef);

        if (interviewsDocSnap.exists()) {
          const data: { answers: InterviewInterface[] } =
            interviewsDocSnap.data();

          if (Array.isArray(data.answers)) {
            dispatch(updateUserReducer({ interviews: data.answers }));
          }
        }

        const cvDocRef = doc(db, 'cvs', email);
        const cvDocSnap = await getDoc(cvDocRef);

        if (cvDocSnap.exists()) {
          const data: CvInterface = cvDocSnap.data();
          dispatch(updateUserReducer({ cv: data }));
        }

        const testsDocRef = doc(db, 'tests', email);
        const testsDocSnap = await getDoc(testsDocRef);

        if (testsDocSnap.exists()) {
          const data = testsDocSnap.data();
          dispatch(updateUserReducer({ tests: data }));
        }

        setIsLoading(false);
      })();
    }
  }, [email, location.pathname]);

  const updateUserData = async (data: Partial<UserInterface>) => {
    setUserData({
      ...userData,
      ...data,
      completedSteps: {
        ...userData.completedSteps,
        ...data.completedSteps,
      },
    });

    const email = data.email || userData.email;

    const userDocRef = doc(db, 'cvs', email);

    await setDoc(userDocRef, data, { merge: true });
  };

  const resetUserData = () => {
    setUserData(initialUserData);
  };

  return (
    <UserContext.Provider
      value={{ isLoading, userData, updateUserData, resetUserData }}
    >
      {children}
    </UserContext.Provider>
  );
}
