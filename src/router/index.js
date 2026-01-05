import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import JobsView from "@/views/jobsView.vue";
import notFoundView from "@/views/notFoundView.vue";
import JobView from "@/views/jobView.vue";
import AddJobView from "@/views/addJobView.vue";
import EditJobViews from "@/views/EditJobViews.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/jobs",
      name: "jobs",
      component: JobsView,
    },
    {
      path: "/jobs/:id",
      name: 'job',
      component: JobView,
    },
     {
      path: "/jobs/add",
      name: 'add-job',
      component: AddJobView,
    },
    {
      path: "/jobs/edit/:id",
      name: 'edit-job',
      component: EditJobViews,
    },
     {
      path: "/:catchAll(.*)",
      name: 'not-found',
      component: notFoundView,
    },
  ],
});

export default router;
