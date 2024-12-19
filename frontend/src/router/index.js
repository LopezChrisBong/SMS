import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import OuterLayout from "../layouts/OuterLayout.vue";
import MainLayout from "../layouts/MainLayout2.vue";
import Register from "../views/Auth/Register.vue";
import Login from "../views/Auth/Login.vue";
import ResetPassword from "../views/Auth/ResetPassword.vue";
import Dashboard from "../views/Pages/Dashboard.vue";
import EmployeeDashboard from "../views/Pages/EmployeeDashboard.vue";
import Profile from "../views/Pages/Profile.vue";
import RegisterSuccess from "../views/Auth/RegisterSuccess.vue";
import UserType from "../views/Pages/UserType.vue";
import AccountVerification from "../views/Pages/AccountVerification.vue";
import Users from "../views/Pages/Users.vue";
import UserModules from "../views/Pages/UserModules.vue";
import ModulesList from "../views/Pages/ModulesList.vue";
import NotFound from "../views/Pages/NotFound.vue";
import EnrollStudents from "../views/Pages/EnrollStudents.vue";
import Student_verify from "../views/Pages/student_verify.vue";
import CreateSubject from "../views/Pages/CreateSubject.vue";
import HishSchoolRooms from "../views/Pages/AddRoomsSection.vue";
import AddTracks from "../views/Pages/addTracks.vue";
import AddStrands from "../views/Pages/AddStrands.vue";
import StudentEnroll from "../views/Auth/StudentEnroll.vue";
import StudentEnrollSuccess from "../views/Auth/StudentEnrollSuccess.vue";
import ClassroomProgramm from "../views/Pages/ClassroomProgramm.vue";
import AvailableFaculty from "../views/Pages/AvailableFaculty.vue";
import MyScheduledProgram from "../views/Pages/MyScheduledProgram.vue";
import AddSchoolYear from "../views/Pages/AddSchoolYear.vue";
import AddElementaryRooms from "../views/Pages/AddElementaryRooms.vue";
import ElementaryProgram from "../views/Pages/ElementaryProgram.vue";
import LandingPage from "../views/Auth/LandingPage.vue";
import TeachersListGradeLevel from "../views/Pages/TeachersListGradeLevel.vue";
import ElementaryTeacherListGradeLevel from "../views/Pages/ElementaryTeacherListGradeLevel.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: OuterLayout,
    redirect: "/landing",
    meta: { authRequired: false },
    children: [
      {
        path: "landing",
        alias: "/landing",
        component: LandingPage,
        meta: { authRequired: false },
      },
      {
        path: "login",
        alias: "/login",
        component: Login,
        meta: { authRequired: false },
      },
      {
        path: "register",
        component: Register,
        meta: { authRequired: false },
      },
      {
        path: "registration-success",
        component: RegisterSuccess,
        meta: { authRequired: false },
      },
      {
        path: "enroll-success",
        component: StudentEnrollSuccess,
        meta: { authRequired: false },
      },
      {
        path: "forgot-pw",
        component: ResetPassword,
        meta: { authRequired: false },
      },
      {
        path: "student-enroll",
        component: StudentEnroll,
        meta: {authRequired: false },
      },
    ],
  },
  {
    path: "*",
    component: NotFound,
    meta: { authRequired: false },
  },
  //admin
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    meta: { RouteForAdmin: true, authRequired: true },
    component: MainLayout,
    children: [
      {
        path: "dashboard",
        component: Dashboard,
        meta: { title: "Dashboard", authRequired: true },
      },
      {
        path: "create-subject",
        component: CreateSubject,
        meta: { title: "Create Subject", authRequired: true },
      },
      {
        path: "high-school-rooms",
        component: HishSchoolRooms,
        meta: { title: "Add High School Rooms", authRequired: true },
      },

      {
        path: "elementary-rooms",
        component: AddElementaryRooms,
        meta: { title: "Add Elementary Rooms", authRequired: true },
      },


      {
        path: "add-tracks",
        component: AddTracks,
        meta: { title: "Add Tracks", authRequired: true },
      },
      {
        path: "add-strands",
        component: AddStrands,
        meta: { title: "Add Strands", authRequired: true },
      },

      {
        path: "acc_verify",
        component: AccountVerification,
        meta: { title: "Account Verification", authRequired: true },
      },
      {
        path: "student_verify",
        component: Student_verify,
        meta: { title: "Verify Student", authRequired: true },
      },
      {
        path: "user-type",
        component: UserType,
        meta: { title: "Utilities - Type of Users", authRequired: true },
      },
      {
        path: "profile",
        component: Profile,
        meta: { title: "My Profile", authRequired: true },
      },
      
      {
        path: "enroll-student",
        component: EnrollStudents,
        meta: { title: "Enroll Students", authRequired: true },
      },    
      {
        path: "modules-list",
        component: ModulesList,
        meta: { title: "List of Modules", authRequired: true },
      },

      {
        path: "user-modules",
        component: UserModules,
        meta: { title: "User Modules", authRequired: true },
      },

      {
        path: "classroom-programm",
        component: ClassroomProgramm,
        meta: { title: "High School Program", authRequired: true },
      },

      {
        path: "elementary-programm",
        component: ElementaryProgram,
        meta: { title: "Elementary Program", authRequired: true },
      },

      {
        path: "faculty-schedule",
        component: AvailableFaculty,
        meta: { title: "Faculty Schedule List", authRequired: true },
      },
      {
        path: "teachers-list",
        component: TeachersListGradeLevel,
        meta: { title: "Faculty List", authRequired: true },
      },

      {
        path: "elementarty-teachers-list",
        component: ElementaryTeacherListGradeLevel,
        meta: { title: "Faculty List", authRequired: true },
      },

      {
        path: "my-scheduled-program",
        component: MyScheduledProgram,
        meta: { title: "My Schedule List", authRequired: true },
      },
      {
        path: "add-school-year",
        component: AddSchoolYear,
        meta: { title: "Add School Year", authRequired: true },
      },

      {
        path: "users",
        component: Users,
        meta: { title: "Utilities - Users", authRequired: true },
      },

      // {
      //   path: "404",
      //   component: NotFound,
      //   meta: { authRequired: true },
      // },
    ],
  },
  //superadmin]
  {
    path: "/superadmin",
    redirect: "/superadmin/dashboard",
    meta: { RouteForSuperAdmin: true, authRequired: true },
    component: MainLayout,
    children: [
      {
        path: "dashboard",
        component: Dashboard,
        meta: { title: "Dashboard", authRequired: true },
      },
      {
        path: "student_verify",
        component: Student_verify,
        meta: { title: "Verify Student", authRequired: true },
      },
      {
        path: "enroll-student",
        component: EnrollStudents,
        meta: { title: "Enroll Students", authRequired: true },
      },
      {
        path: "user-type",
        component: UserType,
        meta: { title: "Utilities - Type of Users", authRequired: true },
      },
      {
        path: "profile",
        component: Profile,
        meta: { title: "My Profile", authRequired: true },
      },
      {
        path: "user-modules",
        component: UserModules,
        meta: { title: "User Modules", authRequired: true },
      },
      {
        path: "modules-list",
        component: ModulesList,
        meta: { title: "List of Modules", authRequired: true },
      },
      {
        path: "acc_verify",
        component: AccountVerification,
        meta: { title: "Account Verification", authRequired: true },
      },
      {
        path: "my-scheduled-program",
        component: MyScheduledProgram,
        meta: { title: "My Schedule List", authRequired: true },
      },
      {
        path: "users",
        component: Users,
        meta: { title: "Utilities - Users", authRequired: true },
      },
      



    ],
  },
  //employee
  {
    path: "/employee",
    meta: { RouteForEmployee: true, authRequired: true },
    component: MainLayout,
    children: [
      {
        path: "/employee",
        alias: "/employee/dashboard",
        component: EmployeeDashboard,
        meta: { title: "Dashboard", authRequired: true },
      },
      {
        path: "profile",
        component: Profile,
        meta: { title: "My Profile", authRequired: true },
      },
      
      {
        path: "student_verify",
        component: Student_verify,
        meta: { title: "Verify Student", authRequired: true },
      },
      {
        path: "enroll-student",
        component: EnrollStudents,
        meta: { title: "Enroll Students", authRequired: true },
      },
      {
        path: "my-scheduled-program",
        component: MyScheduledProgram,
        meta: { title: "My Schedule List", authRequired: true },
      },



    ],
  },
  //security
  // {
  //   path: "/security",
  //   meta: { RouteForSecurity: true, authRequired: true },
  //   component: MainLayout,
  //   children: [
  //     {
  //       path: "/security",
  //       alias: "/security/dashboard",
  //       component: EmployeeDashboard,
  //       meta: { title: "Dashboard", authRequired: true },
  //     },
  //     {
  //       path: "profile",
  //       component: Profile,
  //       meta: { title: "My Profile", authRequired: true },
  //     },
  //     // {
  //     //   path: "qr-scanner",
  //     //   component: ReadQrCode,
  //     //   meta: { title: "Read QR Code", authRequired: true },
  //     // },
  //     // {
  //     //   path: "qr-logs",
  //     //   component: LocatorsLog,
  //     //   meta: { title: "Locator Slip QR Logs", authRequired: true },
  //     // },
  //   ],
  // },
  // //auditor
  // {
  //   path: "/auditor",
  //   meta: { RouteForAuditor: true, authRequired: true },
  //   component: MainLayout,
  //   children: [
  //     {
  //       path: "/auditor",
  //       alias: "/auditor/dashboard",
  //       component: AuditorDashboard,
  //       meta: { title: "Dashboard", authRequired: true },
  //     },

  //     {
  //       path: "audit-ls",
  //       component: AuditLocatorSlip,
  //       meta: { title: "Locator Slip", authRequired: true },
  //     },
  //     {
  //       path: "audit-to",
  //       component: AuditTravelOrder,
  //       meta: { title: "Travel Orders", authRequired: true },
  //     },
  
     
  //   ],
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // let user = store.state.user;
  const isAuthenticated = store.getters.getIsAuthenticated;
  // console.log(to);
  if (to.matched.some((record) => record.meta.authRequired == true)) {
    if (isAuthenticated) {
      let pt = to.fullPath;
      let ptSplit = pt.split("/");

      if (store.state.user.user.usertypeID == 1) {
        if (ptSplit[1].toLowerCase() == "admin") {
          if (!to.matched.length) {
            next("/admin/dashboard");
          } else {
            next();
          }
        } else {
          next("/admin/dashboard");
        }
      } else if (store.state.user.user.usertypeID == 3) {
        if (ptSplit[1].toLowerCase() == "security") {
          if (!to.matched.length) {
            next("/security/dashboard");
          } else {
            next();
          }
        } else {
          next("/security/dashboard");
        }
      } else if (store.state.user.user.usertypeID == 4) {
        if (ptSplit[1].toLowerCase() == "auditor") {
          if (!to.matched.length) {
            next("/auditor/dashboard");
          } else {
            next();
          }
        } else {
          next("/auditor/dashboard");
        }
      } else {
        if (store.state.user.user.user_roleID == 5) {
          if (ptSplit[1].toLowerCase() == "superadmin") {
            if (!to.matched.length) {
              next("/superadmin/dashboard");
            } else {
              next();
            }
          } else {
            next("/superadmin/dashboard");
          }
        } else {
          if (ptSplit[1].toLowerCase() == "employee") {
            if (!to.matched.length) {
              next("/employee/dashboard");
            } else {
              next();
            }
          } else {
            next("/employee/dashboard");
          }
        }
      }
    } else {
      next("/");
    }
  } else {
    if (isAuthenticated) {
      let pt = to.fullPath;
      let ptSplit = pt.split("/");

      if (store.state.user.user.usertypeID == 1) {
        if (ptSplit[1].toLowerCase() == "admin") {
          if (!to.matched.length) {
            next("/admin/dashboard");
          } else {
            next();
          }
        } else {
          next("/admin/dashboard");
        }
      } else if (store.state.user.user.usertypeID == 3) {
        if (ptSplit[1].toLowerCase() == "security") {
          if (!to.matched.length) {
            next("/security/dashboard");
          } else {
            next();
          }
        } else {
          next("/security/dashboard");
        }
      } else if (store.state.user.user.usertypeID == 4) {
        if (ptSplit[1].toLowerCase() == "auditor") {
          if (!to.matched.length) {
            next("/auditor/dashboard");
          } else {
            next();
          }
        } else {
          next("/auditor/dashboard");
        }
      } else {
        if (store.state.user.user.user_roleID == 5) {
          if (ptSplit[1].toLowerCase() == "superadmin") {
            if (!to.matched.length) {
              next("/superadmin/dashboard");
            } else {
              next();
            }
          } else {
            next("/superadmin/dashboard");
          }
        } else {
          if (ptSplit[1].toLowerCase() == "employee") {
            if (!to.matched.length) {
              next("/employee/dashboard");
            } else {
              next();
            }
          } else {
            next("/employee/dashboard");
          }
        }
      }
    } else {
      next();
    }
  }

  // if (to.matched.some(record => record.meta.RouteForAdmin)) {

  //     if (!user) {
  //         next('/')
  //     } else {

  //             // console.log(user.usertypeID);
  //         if (user.usertypeID == 1) {
  //             next()
  //         } else {
  //             next('/')
  //         }
  //     }
  // }
  // else if (to.matched.some(record => record.meta.RouteForDispatchManager)) {
  //     if (!user) {
  //         next({
  //             path: '/'
  //         })
  //     } else {
  //         if (user.usertype.id == 2) {
  //             next()
  //         } else {
  //             next({
  //                 path: '/'
  //             })
  //         }
  //     }
  // }
  // else if (to.matched.some(record => record.meta.RouteForinvoiceManager)) {
  //     if (!user) {
  //         next({
  //             path: '/'
  //         })
  //     } else {
  //         if (user.usertype.id == 3) {
  //             next()
  //         } else {
  //             next({
  //                 path: '/'
  //             })
  //         }
  //     }
  // }
  // else if (to.matched.some(record => record.meta.RouteForChecker)) {
  //     if (!user) {
  //         next({
  //             path: '/'
  //         })
  //     } else {
  //         if (user.usertype.id == 4) {
  //             next()
  //         } else {
  //             next({
  //                 path: '/'
  //             })
  //         }
  //     }
  // }
  // else {

  //     next()
  // }
});

export default router;
