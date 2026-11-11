export type RevisitAndStudyType = 'Revisit' | 'Study';

export interface AuthResponse {
  token: string;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RevisitAndStudy {
  id: string;
  name: string;
  age?: number;
  dayOfWeek?: number;
  details?: string;
  address: string;
  lastVisit?: string;
  type?: RevisitAndStudyType;
}

export interface RevisitAndStudyRequest {
  name: string;
  age?: number | null;
  dayOfWeek?: number;
  details?: string;
  address: string;
  lastVisit?: string;
  type?: RevisitAndStudyType;
}

export const WEEKDAY_LABELS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export function weekdayLabel(dayOfWeek: number | undefined): string {
  return dayOfWeek === undefined ? '' : WEEKDAY_LABELS[dayOfWeek] ?? '';
}
