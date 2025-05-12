import { doc, setDoc } from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { db } from '../lib/firebase';

interface UserData {
    name: string;
    email: string;
    cv?: File;
    sector?: string;
    experience?: string;
    position?: string;
    testResults?: {
        cognitiveBias: number;
        problemSolving: number;
        decisionMaking: number;
        criticalThinking: number;
    };
    completedSteps: {
        cvUploaded?: boolean;
        prequalificationCompleted?: boolean;
        interviewCompleted?: boolean;
        testStarted?: boolean;
        testCompleted?: boolean;
        completedFormation?: boolean;
        receivedResults?: boolean;
    };
}

interface UserContextType {
    userData: UserData;
    updateUserData: (data: Partial<UserData>) => Promise<void>;
    resetUserData: () => void;
}

const initialUserData: UserData = {
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

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData>(initialUserData);

    const updateUserData = async (data: Partial<UserData>) => {
        setUserData({
            ...userData,
            ...data,
            completedSteps: {
                ...userData.completedSteps,
                ...data.completedSteps,
            },
        });

        const email = data.email || userData.email;
        // Remove File objects before sending to Firestore
        if (data.cv instanceof File) {
            delete data.cv;
        }
        console.log(email);

        const userDocRef = doc(db, 'cvs', email);

        await setDoc(userDocRef, data, { merge: true });
    };

    const resetUserData = () => {
        setUserData(initialUserData);
    };

    return (
        <UserContext.Provider value={{ userData, updateUserData, resetUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;
