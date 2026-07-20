export interface Attempt {
  id?: number;
  routeId: number;
  date: string;
  success: boolean;
  notes?: string;
  media?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttemptInput = Omit<Attempt, "id" | "createdAt" | "updatedAt">;
