export type WallType = "traverse" | "boulder";

export interface Wall {
  id?: number;
  hallAreaId: number;
  name: string;
  type: WallType;
  lastSetDate: string;
  createdAt: string;
  updatedAt: string;
}

export type WallInput = Omit<Wall, "id" | "createdAt" | "updatedAt">;
