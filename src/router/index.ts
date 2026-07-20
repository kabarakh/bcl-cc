import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "halls",
      component: () => import("@/views/HallListView.vue")
    },
    {
      path: "/halls/:hallId",
      name: "hall",
      component: () => import("@/views/HallView.vue"),
      props: true
    },
    {
      path: "/areas/:areaId",
      name: "area",
      component: () => import("@/views/AreaView.vue"),
      props: true
    },
    {
      path: "/walls/:wallId",
      name: "wall",
      component: () => import("@/views/WallView.vue"),
      props: true
    },
    {
      path: "/routes/:routeId",
      name: "route",
      component: () => import("@/views/RouteView.vue"),
      props: true
    },
    {
      // Phase-3-Playground fuer die gemeinsamen Komponenten, weiterhin
      // nuetzlich fuer manuelle Komponenten-Tests ausserhalb der echten Views.
      path: "/playground",
      name: "playground",
      component: () => import("@/views/ComponentPlaygroundView.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue")
    }
  ]
});

export default router;
