import { TestResponseInterface } from './TestResponse.interface';

export interface TestInterviewInterface {
  answers?: TestResponseInterface[];
  highContent?: string;
  weakContent?: string;
  synthese?: string;
  email: string;
}
