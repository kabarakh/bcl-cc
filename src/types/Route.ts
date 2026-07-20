export interface Route {
  id?: number;
  wallId: number;
  difficulty: string;
  type?: string;
  media: string[];
  color: string;
  setDate: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RouteInput = Omit<Route, "id" | "createdAt" | "updatedAt">;
