import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const useNavigation = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  
  const goToPage = (path: string) => {
    navigate(path);
  };
  
  const goToNextStep = () => {
    const { completedSteps } = userData;
    
    if (!completedSteps.cvUploaded) {
      navigate('/');
    } else if (!completedSteps.prequalificationCompleted) {
      navigate('/prequalification');
    } else if (!completedSteps.testStarted) {
      navigate('/landing');
    } else if (!completedSteps.testCompleted) {
      navigate('/test');
    } else if (!completedSteps.receivedResults) {
      navigate('/results');
    } else {
      navigate('/formation');
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  return {
    goToPage,
    goToNextStep,
    goBack
  };
};

export default useNavigation;