export interface HallArea {
  id?: number;
  hallId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type HallAreaInput = Omit<HallArea, "id" | "createdAt" | "updatedAt">;
