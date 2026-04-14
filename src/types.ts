export type Language = 'en' | 'ml' | 'hi' | 'ar';

export type Gender = 'Male' | 'Female' | 'Other';

export interface UserData {
  name: string;
  dob: string;
  gender: Gender;
  leftPalm: string | null;
  rightPalm: string | null;
}

export type Step = 
  | 'LANGUAGE_SELECT'
  | 'INTRO'
  | 'ASK_NAME'
  | 'ASK_DOB'
  | 'ASK_GENDER'
  | 'ASK_LEFT_PALM'
  | 'ASK_RIGHT_PALM'
  | 'READING'
  | 'RESULTS'
  | 'CHAT';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ReadingResult {
  personality: string;
  lifePath: string;
  love: string;
  career: string;
  destiny: string;
  warnings: string;
}
