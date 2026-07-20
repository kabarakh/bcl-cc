import { db } from "@/db/database";
import { BaseRepository } from "./baseRepository";
import type { Route, RouteInput } from "@/types/Route";

export class RouteRepository extends BaseRepository<Route, RouteInput> {
  constructor() {
    super(db.routes);
  }

  async getByWall(wallId: number, includeArchived = false): Promise<Route[]> {
    const routes = await this.table.where("wallId").equals(wallId).toArray();
    return includeArchived ? routes : routes.filter((route) => !route.archived);
  }
}

export const routeRepository = new RouteRepository();
