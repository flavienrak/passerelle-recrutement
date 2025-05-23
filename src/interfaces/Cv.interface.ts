export interface CvInterface {
  cvContent: string;
  presentation: string;
  presentation_anonym: string;
  diplomes: { content: string; order: number }[];
  formations: { content: string; order: number }[];
  competences: { content: string; order: number }[];
  experiences: { content: string; order: number }[];
  diplomes_anonym?: string[];
  formations_anonym?: string[];
  competence_anonym?: string | null;
  experiences_anonym?: {
    title: string;
    date: string;
    company: string;
    description: string;
  }[];
  completedSteps?: {
    cvUploaded: boolean;
    anonymisation: boolean;
    interviewCompleted: boolean;
    testCompleted: boolean;
  };
}
