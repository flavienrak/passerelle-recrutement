import React from 'react';
import Loader from '../components/Loader';

import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { InterviewInterface } from '../interfaces/Interview.interface';
import { updateUserReducer } from '../redux/slices/user.slice';
import { CvInterface } from '../interfaces/Cv.interface';

export default function UserLayout() {
  const { userId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) {
      navigate('/');
    } else {
      (async () => {
        const cvDocSnap = await getDoc(doc(db, 'cvs', userId));

        if (cvDocSnap.exists()) {
          const data: CvInterface = cvDocSnap.data();
          dispatch(updateUserReducer({ cv: data }));

          const interviewsDocSnap = await getDoc(doc(db, 'interviews', userId));

          if (interviewsDocSnap.exists()) {
            const data: { answers: InterviewInterface[] } =
              interviewsDocSnap.data();

            if (Array.isArray(data.answers)) {
              dispatch(updateUserReducer({ interviews: data.answers }));
            }
          }

          const testsDocSnap = await getDoc(doc(db, 'tests', userId));

          if (testsDocSnap.exists()) {
            const data = testsDocSnap.data();
            dispatch(updateUserReducer({ tests: data }));
          }
        } else {
          navigate('/');
        }

        setIsLoading(false);
      })();
    }
  }, [userId, location.pathname]);

  if (isLoading) return <Loader />;
  return <Outlet />;
}
