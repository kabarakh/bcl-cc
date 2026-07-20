export interface Hall {
  id?: number;
  name: string;
  address: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export type HallInput = Omit<Hall, "id" | "createdAt" | "updatedAt">;
