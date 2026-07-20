export const DB_NAME = "boulder-tracker";
export const DB_VERSION = 1;

export const SCHEMA_V1 = {
  halls: "++id,&name",
  hallAreas: "++id,hallId,&name",
  walls: "++id,hallAreaId,&name,type,lastSetDate",
  routes: "++id,wallId,difficulty,color,archived",
  attempts: "++id,routeId,date,success"
};
