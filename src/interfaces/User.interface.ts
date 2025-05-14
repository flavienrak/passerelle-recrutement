export interface UserInterface {
  email: string;
  name?: string;
  cvContent?: string;
  sector?: string;
  experience?: string;
  position?: string;
  presentation?: string;
  diplomes?: { content: string; order: number }[];
  formations?: { content: string; order: number }[];
  competences?: { content: string; order: number }[];
  experiences?: { content: string; order: number }[];
  diplomes_anonym?: string[];
  formation_anonym?: string;
  competence_anonym?: string;
  experiences_anonym?: {
    title: string;
    date: string;
    company: string;
    description: string;
  }[];
  testResults?: {
    cognitiveBias: number;
    problemSolving: number;
    decisionMaking: number;
    criticalThinking: number;
  };
  completedSteps?: {
    cvUploaded?: boolean;
    anonymisation?: boolean;
    prequalificationCompleted?: boolean;
    interviewCompleted?: boolean;
    testStarted?: boolean;
    testCompleted?: boolean;
    completedFormation?: boolean;
    receivedResults?: boolean;
  };
}
