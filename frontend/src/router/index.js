import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import OuterLayout from "../layouts/OuterLayout.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Register from "../views/Auth/Register.vue";
import Login from "../views/Auth/Login.vue";
import ResetPassword from "../views/Auth/ResetPassword.vue";
import Dashboard from "../views/Pages/Dashboard.vue";
import EmployeeDashboard from "../views/Pages/EmployeeDashboard.vue";
import EmployeeType from "../views/Pages/EmployeeType.vue";
import EmployeePDS from "../views/Pages/EmployeePDS.vue";
// import Otp from '../views/Auth/Otp.vue'
import MyPDS from "../views/Pages/MyPDS.vue";
import Profile from "../views/Pages/Profile.vue";
import AllowPDSUpdate from "../views/Pages/AllowPDSUpdate.vue";
import Offices from "../views/Pages/Offices.vue";
import Position from "../views/Pages/Position.vue";
import Designation from "../views/Pages/Designation.vue";
import RegisterSuccess from "../views/Auth/RegisterSuccess.vue";
import UserType from "../views/Pages/UserType.vue";
import AccountVerification from "../views/Pages/AccountVerification.vue";
import EmployeeDetails from "../views/Pages/EmployeeDetails.vue";
import MyLeave from "../views/Pages/MyLeave.vue";
import MyLocatorSlip from "../views/Pages/MyLocatorSlip.vue";
import MyDirectHead from "../views/Pages/MyDirectHead.vue";
import Institutes from "../views/Pages/Institutes.vue";
import Users from "../views/Pages/Users.vue";
import SalaryGrades from "../views/Pages/SalaryGrades.vue";
import ReadQrCode from "../views/Pages/ReadQrCode.vue";
import Locators from "../views/Pages/Locators.vue";
import LocatorsLog from "../views/Pages/LocatorsLog.vue";
import TravelOrder from "../views/Pages/TravelOrder.vue";
import MyTravelOrder from "../views/Pages/MyTravelOrder.vue";
import TOApproval from "../views/Pages/TOApproval.vue";
import MyCoreTimeDesignation from "../views/Pages/MyCoreTimeDesignation.vue";
import CTDApproval from "../views/Pages/CTDApproval.vue";
import UserModules from "../views/Pages/UserModules.vue";
import ModulesList from "../views/Pages/ModulesList.vue";
import IldpCalendar from "../views/Pages/IldpCalendar.vue";
import MyILDP from "../views/Pages/MyILDP.vue";
import ILDPApproval from "../views/Pages/ILDPApproval.vue";
import ILDP from "../views/Pages/ILDP.vue";
import LocatorSlips from "../views/Pages/LocatorSlips.vue";
import MyRequests from "../views/Pages/MyRequests.vue";
import DocumentRequests from "../views/Pages/DocumentRequests.vue";
import ESignature from "../views/Pages/ESignature.vue";
import ServiceRecord from "../views/Pages/ServiceRecord.vue";
import MySALN from "../views/Pages/MySALN.vue";
import TARApproval from "../views/Pages/TARApproval.vue";
import HRTARApproval from "../views/Pages/HRTARApproval.vue";
import SALN from "../views/Pages/SALN.vue";
import EmployeeAssessment from "../views/Pages/EmployeeAssessment.vue";
import EmployeeAssessmentRating from "../views/Pages/EmployeeAssessmentRating.vue";
import SchoolYear from "../views/Pages/SchoolYear.vue";
import NotFound from "../views/Pages/NotFound.vue";
import Leaves from "../views/Pages/Leaves.vue";
import LeaveApproval from "../views/Pages/LeaveApproval.vue";
import HRLeaveApproval from "../views/Pages/HRLeaveApproval.vue";
import DesignationApproval from "../views/Pages/DesignationApproval.vue";
import CoreTimeApproval from "../views/Pages/CoreTimeApproval.vue";
import DTR from "../views/Pages/DTR.vue";
import MyDTR from "../views/Pages/MyDTR.vue";
import JobPosting from "../views/Pages/JobPosting.vue";
import MyOIC from "../views/Pages/MyOIC.vue";
import EmployeeHired from "../views/Pages/EmployeeHired.vue";
import AuditDTR from "../views/Pages/AuditDTR.vue";
import AuditLeave from "../views/Pages/AuditLeave.vue";
import AuditTravelOrder from "../views/Pages/AuditTravelOrder.vue";
import AuditLocatorSlip from "../views/Pages/AuditLocatorSlip.vue";
import TaggedResolution from "../views/Pages/TaggingResolution.vue";
import PerformanceEvaluation from "../views/Pages/PerformanceEvaluation.vue";
import IPCRSupportUtil from "../views/Pages/IPCRSupportUtil.vue";
import MPORApproval from "../views/Pages/MPORApproval.vue";
import IPCRApproval from "../views/Pages/IPCRApproval.vue";
import IPCRTargetApproval from "../views/Pages/IPCRTargetApproval.vue";
import IPCRSummaryApproval from "../views/Pages/IpcrSummaryApproval.vue";
import AuditorDashboard from "../views/Pages/AuditorDashboard.vue";
import ShortListedJobApplicant from "../views/Pages/ShortListedJobApplicant.vue";
import StrategicPlanning from "../views/Pages/StrategicPlanning.vue";
import IPCRQualityUtil from "../views/Pages/IPCRQualityUtil.vue";
import IPCREmployeeSupportFunction from "../views/Pages/IPCREmployeeSupportFunction.vue";
import OPCR from "../views/Pages/OPCR.vue";
import IPCRTimelinessUtil from "../views/Pages/IPCRTimelinessUtil.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: OuterLayout,
    redirect: "/login",
    meta: { authRequired: false },
    children: [
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
        path: "forgot-pw",
        component: ResetPassword,
        meta: { authRequired: false },
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
        path: "jobposting",
        component: JobPosting,
        meta: { title: "Job Posting", authRequired: true },
      },
      {
        path: "modules-list",
        component: ModulesList,
        meta: { title: "List of Modules", authRequired: true },
      },
      {
        path: "employee-hired",
        component: EmployeeHired,
        meta: { title: "Employee Hired", authRequired: true },
      },
      {
        path: "employee-pds",
        component: EmployeePDS,
        meta: { title: "Employee PDS", authRequired: true },
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
        path: "locators",
        component: Locators,
        meta: { title: "Locator Slips to Verify", authRequired: true },
      },
      {
        path: "employee-type",
        component: EmployeeType,
        meta: { title: "Utilities - Employee Type", authRequired: true },
      },
      {
        path: "allow-update",
        component: AllowPDSUpdate,
        meta: { title: "Utilities - Allow PDS Update", authRequired: true },
      },
      {
        path: "offices",
        component: Offices,
        meta: { title: "Utilities - Offices", authRequired: true },
      },
      {
        path: "positions",
        component: Position,
        meta: { title: "Utilities - Positions", authRequired: true },
      },
      {
        path: "designations",
        component: Designation,
        meta: { title: "Utilities - Designations", authRequired: true },
      },
      {
        path: "institutes",
        component: Institutes,
        meta: { title: "Utilities - Institutes", authRequired: true },
      },
      {
        path: "acc_verify",
        component: AccountVerification,
        meta: { title: "Account Verification", authRequired: true },
      },
      {
        path: "employee-details",
        component: EmployeeDetails,
        meta: { title: "Employee Details", authRequired: true },
      },
      {
        path: "salary-grades",
        component: SalaryGrades,
        meta: { title: "Salary Grades", authRequired: true },
      },
      {
        path: "users",
        component: Users,
        meta: { title: "Utilities - Users", authRequired: true },
      },
      {
        path: "my-pds",
        component: MyPDS,
        meta: { title: "My PDS", authRequired: true },
      },
      {
        path: "my-leave",
        component: MyLeave,
        meta: { title: "My Leave", authRequired: true },
      },
      {
        path: "my-locator-slip",
        component: MyLocatorSlip,
        meta: { title: "My Locator Slip", authRequired: true },
      },
      {
        path: "my-direct-head",
        component: MyDirectHead,
        meta: { title: "My Direct Head", authRequired: true },
      },
      {
        path: "my-travel-order",
        component: MyTravelOrder,
        meta: { title: "My Travel Orders", authRequired: true },
      },
      {
        path: "my-coretime-designation",
        component: MyCoreTimeDesignation,
        meta: { title: "My Core-Time and Designations ", authRequired: true },
      },
      {
        path: "my-requests",
        component: MyRequests,
        meta: { title: "My Requests", authRequired: true },
      },
      {
        path: "travel-orders",
        component: TravelOrder,
        meta: { title: "Travel Orders", authRequired: true },
      },
      {
        path: "ctd-approval",
        component: CTDApproval,
        meta: {
          title: "Core-Time & Designation Approval",
          authRequired: true,
        },
      },
      {
        path: "to-approval",
        component: TOApproval,
        meta: { title: "Travel Orders Approval", authRequired: true },
      },
      {
        path: "user-modules",
        component: UserModules,
        meta: { title: "User Modules", authRequired: true },
      },
      {
        path: "ildp-calendar",
        component: IldpCalendar,
        meta: { title: "ILDP Calendar Year", authRequired: true },
      },
      {
        path: "my-ildp",
        component: MyILDP,
        meta: { title: "My ILDP", authRequired: true },
      },
      {
        path: "ildp-approval",
        component: ILDPApproval,
        meta: { title: "ILDP Approval", authRequired: true },
      },
      {
        path: "ildp",
        component: ILDP,
        meta: { title: "ILDP", authRequired: true },
      },
      {
        path: "locator-slips",
        component: LocatorSlips,
        meta: { title: "Locator Slips", authRequired: true },
      },
      {
        path: "document-requests",
        component: DocumentRequests,
        meta: { title: "Document Requests", authRequired: true },
      },
      {
        path: "my-esign",
        component: ESignature,
        meta: { title: "E-Signature", authRequired: true },
      },
      {
        path: "service-record",
        component: ServiceRecord,
        meta: { title: "Service Records", authRequired: true },
      },
      {
        path: "my-saln",
        component: MySALN,
        meta: { title: "My SALN", authRequired: true },
      },
      {
        path: "saln",
        component: SALN,
        meta: { title: "SALN", authRequired: true },
      },
      {
        path: "tar-approval",
        component: TARApproval,
        meta: { title: "TAR Approval", authRequired: true },
      },
      {
        path: "hrtar-approval",
        component: HRTARApproval,
        meta: { title: "TAR Approval", authRequired: true },
      },
      {
        path: "employee-assessment",
        component: EmployeeAssessment,
        meta: { title: "Employee Assessment", authRequired: true },
      },
      {
        path: "employee-assessment-rating",
        component: EmployeeAssessmentRating,
        meta: { title: "Employee Assessment Rating", authRequired: true },
      },
      {
        path: "school-year",
        component: SchoolYear,
        meta: { title: "School Year", authRequired: true },
      },
      {
        path: "leaves",
        component: Leaves,
        meta: { title: "Employee Leaves", authRequired: true },
      },
      {
        path: "leave-approval",
        component: LeaveApproval,
        meta: { title: "Leave Approval", authRequired: true },
      },
      {
        path: "hr-leave-approval",
        component: HRLeaveApproval,
        meta: { title: "Leave Approval", authRequired: true },
      },
      {
        path: "designation-approval",
        component: DesignationApproval,
        meta: { title: "Designation Approval", authRequired: true },
      },
      {
        path: "coretime-approval",
        component: CoreTimeApproval,
        meta: { title: "Core-Time Approval", authRequired: true },
      },
      {
        path: "dtr",
        component: DTR,
        meta: { title: "Daily Time Record", authRequired: true },
      },
      {
        path: "my-dtr",
        component: MyDTR,
        meta: { title: "My Daily Time Record", authRequired: true },
      },
      {
        path: "my-oic",
        component: MyOIC,
        meta: { title: "My OIC", authRequired: true },
      },
      {
        path: "tagged-resolutions",
        component: TaggedResolution,
        meta: { title: "Resolutions", authRequired: true },
      },

      {
        path: "ipcr",
        component: PerformanceEvaluation,
        meta: { title: "IPCR", authRequired: true },
      },
      {
        path: "ipcr-support-util",
        component: IPCRSupportUtil,
        meta: { title: "IPCR Support Utility", authRequired: true },
      },
      {
        path: "mpor-approval",
        component: MPORApproval,
        meta: { title: "MPOR Approval", authRequired: true },
      },
      {
        path: "ipcr-approval",
        component: IPCRApproval,
        meta: { title: "IPCR Approval", authRequired: true },
      },

      {
        path: "ipcr-targets-approval",
        component: IPCRTargetApproval,
        meta: { title: "IPCR Targets Approval", authRequired: true },
      },
      {
        path: "ipcr-summary-approval",
        component: IPCRSummaryApproval,
        meta: { title: "IPCR Summary Approval", authRequired: true },
      },
      {
        path: "short-list",
        component: ShortListedJobApplicant,
        meta: { title: "Short Listed Job Applicants", authRequired: true },
      },
      {
        path: "ipcr-quality-util",
        component: IPCRQualityUtil,
        meta: { title: "IPCR Quality Utility", authRequired: true },
      },
      {
        path: "ipcr-timeliness-util",
        component: IPCRTimelinessUtil,
        meta: { title: "IPCR Timeliness Utility", authRequired: true },
      },
      
      {
        path: "ipcr-support-function",
        component: IPCREmployeeSupportFunction,
        meta: { title: "Employee Support Function", authRequired: true },
      },
      {
        path: "opcr",
        component: OPCR,
        meta: { title: "OPCR", authRequired: true },
        beforeEnter: (to, from, next) => {
          if (
            store.state.user.user.user_roleID != 2 &&
            store.state.user.user.user_roleID != 5 &&
            store.state.user.user.user_roleID != 10
          ) {
            console.log(to.name, from.name);
            next();
          } else {
            next("/");
          }
        },
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
        path: "jobposting",
        component: JobPosting,
        meta: { title: "Job Posting", authRequired: true },
      },
      {
        path: "employee-hired",
        component: EmployeeHired,
        meta: { title: "Employee Hired", authRequired: true },
      },
      {
        path: "employee-pds",
        component: EmployeePDS,
        meta: { title: "Employee PDS", authRequired: true },
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
        path: "locators",
        component: Locators,
        meta: { title: "Locator Slips to Verify", authRequired: true },
      },
      {
        path: "employee-type",
        component: EmployeeType,
        meta: { title: "Utilities - Employee Type", authRequired: true },
      },
      {
        path: "allow-update",
        component: AllowPDSUpdate,
        meta: { title: "Utilities - Allow PDS Update", authRequired: true },
      },
      {
        path: "offices",
        component: Offices,
        meta: { title: "Utilities - Offices", authRequired: true },
      },
      {
        path: "positions",
        component: Position,
        meta: { title: "Utilities - Positions", authRequired: true },
      },
      {
        path: "designations",
        component: Designation,
        meta: { title: "Utilities - Designations", authRequired: true },
      },
      {
        path: "institutes",
        component: Institutes,
        meta: { title: "Utilities - Institutes", authRequired: true },
      },
      {
        path: "acc_verify",
        component: AccountVerification,
        meta: { title: "Account Verification", authRequired: true },
      },
      {
        path: "employee-details",
        component: EmployeeDetails,
        meta: { title: "Employee Details", authRequired: true },
      },
      {
        path: "salary-grades",
        component: SalaryGrades,
        meta: { title: "Salary Grades", authRequired: true },
      },
      {
        path: "users",
        component: Users,
        meta: { title: "Utilities - Users", authRequired: true },
      },
      {
        path: "my-pds",
        component: MyPDS,
        meta: { title: "My PDS", authRequired: true },
      },
      {
        path: "my-leave",
        component: MyLeave,
        meta: { title: "My Leave", authRequired: true },
      },
      {
        path: "my-locator-slip",
        component: MyLocatorSlip,
        meta: { title: "My Locator Slip", authRequired: true },
      },
      {
        path: "my-direct-head",
        component: MyDirectHead,
        meta: { title: "My Direct Head", authRequired: true },
      },
      {
        path: "my-travel-order",
        component: MyTravelOrder,
        meta: { title: "My Travel Orders", authRequired: true },
      },
      {
        path: "my-coretime-designation",
        component: MyCoreTimeDesignation,
        meta: { title: "My Core-Time and Designations ", authRequired: true },
      },
      {
        path: "my-requests",
        component: MyRequests,
        meta: { title: "My Requests", authRequired: true },
      },

      {
        path: "my-esign",
        component: ESignature,
        meta: { title: "E-Signature", authRequired: true },
      },
      {
        path: "travel-orders",
        component: TravelOrder,
        meta: { title: "Travel Orders", authRequired: true },
      },
      {
        path: "ctd-approval",
        component: CTDApproval,
        meta: {
          title: "Core-Time & Designation Approval",
          authRequired: true,
        },
      },
      {
        path: "to-approval",
        component: TOApproval,
        meta: { title: "Travel Orders Approval", authRequired: true },
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
        path: "ildp-calendar",
        component: IldpCalendar,
        meta: { title: "ILDP Calendar Year", authRequired: true },
      },
      {
        path: "qr-scanner",
        component: ReadQrCode,
        meta: { title: "Read QR Code", authRequired: true },
      },
      {
        path: "qr-logs",
        component: LocatorsLog,
        meta: { title: "Locator Slip QR Logs", authRequired: true },
      },
      {
        path: "my-ildp",
        component: MyILDP,
        meta: { title: "My ILDP", authRequired: true },
      },
      {
        path: "ildp-approval",
        component: ILDPApproval,
        meta: { title: "ILDP Approval", authRequired: true },
      },
      {
        path: "ildp",
        component: ILDP,
        meta: { title: "ILDP", authRequired: true },
      },
      {
        path: "locator-slips",
        component: LocatorSlips,
        meta: { title: "Locator Slips", authRequired: true },
      },
      {
        path: "document-requests",
        component: DocumentRequests,
        meta: { title: "Document Requests", authRequired: true },
      },
      {
        path: "service-record",
        component: ServiceRecord,
        meta: { title: "Service Records", authRequired: true },
      },
      {
        path: "my-saln",
        component: MySALN,
        meta: { title: "My SALN", authRequired: true },
      },
      {
        path: "tar-approval",
        component: TARApproval,
        meta: { title: "TAR Approval", authRequired: true },
      },
      {
        path: "hrtar-approval",
        component: HRTARApproval,
        meta: { title: "TAR Approval", authRequired: true },
      },
      {
        path: "saln",
        component: SALN,
        meta: { title: "SALN", authRequired: true },
      },
      {
        path: "employee-assessment",
        component: EmployeeAssessment,
        meta: { title: "Employee Assessment", authRequired: true },
      },
      {
        path: "employee-assessment-rating",
        component: EmployeeAssessmentRating,
        meta: { title: "Employee Assessment Rating", authRequired: true },
      },

      {
        path: "school-year",
        component: SchoolYear,
        meta: { title: "School Year", authRequired: true },
      },
      {
        path: "leaves",
        component: Leaves,
        meta: { title: "Employee Leaves", authRequired: true },
      },
      {
        path: "leave-approval",
        component: LeaveApproval,
        meta: { title: "Leave Approval", authRequired: true },
      },
      {
        path: "designation-approval",
        component: DesignationApproval,
        meta: { title: "Designation Approval", authRequired: true },
      },
      {
        path: "coretime-approval",
        component: CoreTimeApproval,
        meta: { title: "Core-Time Approval", authRequired: true },
      },

      {
        path: "dtr",
        component: DTR,
        meta: { title: "Daily Time Record", authRequired: true },
      },
      {
        path: "my-dtr",
        component: MyDTR,
        meta: { title: "My Daily Time Record", authRequired: true },
      },
      {
        path: "my-oic",
        component: MyOIC,
        meta: { title: "My OIC", authRequired: true },
      },
      {
        path: "audit-ls",
        component: AuditLocatorSlip,
        meta: { title: "Locator Slip", authRequired: true },
        beforeEnter: (to, from, next) => {
          if (
            store.state.user.user.user_roleID == 5 ||
            store.state.user.user.user_roleID == 13
          ) {
            console.log(to.name, from.name);
            next();
          } else {
            next("/");
          }
        },
      },
      {
        path: "audit-to",
        component: AuditTravelOrder,
        meta: { title: "Travel Orders", authRequired: true },
        beforeEnter: (to, from, next) => {
          if (
            store.state.user.user.user_roleID == 5 ||
            store.state.user.user.user_roleID == 13
          ) {
            console.log(to.name, from.name);
            next();
          } else {
            next("/");
          }
        },
      },
      {
        path: "audit-dtr",
        component: AuditDTR,
        meta: { title: "DTR (Daily Time Record)", authRequired: true },
        beforeEnter: (to, from, next) => {
          if (
            store.state.user.user.user_roleID == 5 ||
            store.state.user.user.user_roleID == 13
          ) {
            console.log(to.name, from.name);
            next();
          } else {
            next("/");
          }
        },
      },
      {
        path: "audit-leave",
        component: AuditLeave,
        meta: { title: "Leave of Absence", authRequired: true },
        beforeEnter: (to, from, next) => {
          if (
            store.state.user.user.user_roleID == 5 ||
            store.state.user.user.user_roleID == 13
          ) {
            console.log(to.name, from.name);
            next();
          } else {
            next("/");
          }
        },
      },
      {
        path: "ipcr",
        component: PerformanceEvaluation,
        meta: { title: "IPCR", authRequired: true },
      },
      {
        path: "short-list",
        component: ShortListedJobApplicant,
        meta: { title: "Short Listed Job Applicants", authRequired: true },
      },
      {
        path: "strategic-planning",
        component: StrategicPlanning,
        meta: { title: "Strategic Planning", authRequired: true },
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
        path: "locators",
        component: Locators,
        meta: { title: "Locator Slips to Verify", authRequired: true },
      },
      {
        path: "my-pds",
        component: MyPDS,
        meta: { title: "My PDS", authRequired: true },
      },
      {
        path: "my-leave",
        component: MyLeave,
        meta: { title: "My Leave", authRequired: true },
      },
      {
        path: "my-locator-slip",
        component: MyLocatorSlip,
        meta: { title: "My Locator Slip", authRequired: true },
      },
      {
        path: "my-direct-head",
        component: MyDirectHead,
        meta: { title: "My Direct Head", authRequired: true },
      },
      {
        path: "my-travel-order",
        component: MyTravelOrder,
        meta: { title: "My Travel Orders", authRequired: true },
      },
      {
        path: "my-coretime-designation",
        component: MyCoreTimeDesignation,
        meta: { title: "My Core-Time and Designations ", authRequired: true },
      },
      {
        path: "my-requests",
        component: MyRequests,
        meta: { title: "My Requests", authRequired: true },
      },
      {
        path: "travel-orders",
        component: TravelOrder,
        meta: { title: "Travel Orders", authRequired: true },
      },
      {
        path: "my-esign",
        component: ESignature,
        meta: { title: "E-Signature", authRequired: true },
      },
      {
        path: "to-approval",
        component: TOApproval,
        meta: { title: "Travel Orders Approval", authRequired: true },
      },
      {
        path: "my-ildp",
        component: MyILDP,
        meta: { title: "My ILDP", authRequired: true },
      },
      {
        path: "ctd-approval",
        component: CTDApproval,
        meta: {
          title: "Core-Time & Designation Approval",
          authRequired: true,
        },
      },
      {
        path: "ildp-approval",
        component: ILDPApproval,
        meta: { title: "ILDP Approval", authRequired: true },
      },
      {
        path: "ildp",
        component: ILDP,
        meta: { title: "ILDP", authRequired: true },
      },
      {
        path: "my-saln",
        component: MySALN,
        meta: { title: "My SALN", authRequired: true },
      },
      {
        path: "tar-approval",
        component: TARApproval,
        meta: { title: "TAR Approval", authRequired: true },
      },

      {
        path: "employee-assessment-rating",
        component: EmployeeAssessmentRating,
        meta: { title: "Employee Assessment Rating", authRequired: true },
      },
      {
        path: "leave-approval",
        component: LeaveApproval,
        meta: { title: "Leave Approval", authRequired: true },
      },
      {
        path: "coretime-approval",
        component: CoreTimeApproval,
        meta: { title: "Core-Time Approval", authRequired: true },
      },
      {
        path: "my-dtr",
        component: MyDTR,
        meta: { title: "My Daily Time Record", authRequired: true },
      },
      {
        path: "my-oic",
        component: MyOIC,
        meta: { title: "My OIC", authRequired: true },
      },

      {
        path: "audit-ls",
        component: AuditLocatorSlip,
        meta: { title: "Locator Slip", authRequired: true },
        beforeEnter: (to, from, next) => {
          if (
            store.state.user.user.user_roleID == 5 ||
            store.state.user.user.user_roleID == 13
          ) {
            console.log(to.name, from.name);
            next();
          } else {
            next("/");
          }
        },
      },
      {
        path: "audit-to",
        component: AuditTravelOrder,
        meta: { title: "Travel Orders", authRequired: true },
        beforeEnter: (to, from, next) => {
          if (
            store.state.user.user.user_roleID == 5 ||
            store.state.user.user.user_roleID == 13
          ) {
            console.log(to.name, from.name);
            next();
          } else {
            next("/");
          }
        },
      },
      {
        path: "audit-dtr",
        component: AuditDTR,
        meta: { title: "DTR (Daily Time Record)", authRequired: true },
        beforeEnter: (to, from, next) => {
          if (
            store.state.user.user.user_roleID == 5 ||
            store.state.user.user.user_roleID == 13
          ) {
            console.log(to.name, from.name);
            next();
          } else {
            next("/");
          }
        },
      },
      {
        path: "audit-leave",
        component: AuditLeave,
        meta: { title: "Leave of Absence", authRequired: true },
        beforeEnter: (to, from, next) => {
          if (
            store.state.user.user.user_roleID == 5 ||
            store.state.user.user.user_roleID == 13
          ) {
            console.log(to.name, from.name);
            next();
          } else {
            next("/");
          }
        },
      },
      {
        path: "ipcr",
        component: PerformanceEvaluation,
        meta: { title: "IPCR", authRequired: true },
      },
      {
        path: "mpor-approval",
        component: MPORApproval,
        meta: { title: "MPOR Approval", authRequired: true },
      },
      {
        path: "ipcr-approval",
        component: IPCRApproval,
        meta: { title: "IPCR Approval", authRequired: true },
      },
      {
        path: "ipcr-targets-approval",
        component: IPCRTargetApproval,
        meta: { title: "IPCR Targets Approval", authRequired: true },
      },
      {
        path: "ipcr-summary-approval",
        component: IPCRSummaryApproval,
        meta: { title: "IPCR Summary Approval", authRequired: true },
      },
      {
        path: "short-list",
        component: ShortListedJobApplicant,
        meta: { title: "Short Listed Job Applicants", authRequired: true },
      },

      {
        path: "opcr",
        component: OPCR,
        meta: { title: "OPCR", authRequired: true },
        beforeEnter: (to, from, next) => {
          if (
            store.state.user.user.user_roleID != 2 &&
            store.state.user.user.user_roleID != 5 &&
            store.state.user.user.user_roleID != 10
          ) {
            next();
          } else {
            next("/");
          }
        },
      },

      {
        path: "strategic-planning",
        component: StrategicPlanning,
        meta: { title: "Strategic Planning", authRequired: true },
        beforeEnter: (to, from, next) => {
          console.log("STORE", store.state.emp);
          if (store.state.emp.officeID == 25) {
            next();
          } else {
            alert("Access denied!");
            next("/");
          }
        },
      },
    ],
  },
  //security
  {
    path: "/security",
    meta: { RouteForSecurity: true, authRequired: true },
    component: MainLayout,
    children: [
      {
        path: "/security",
        alias: "/security/dashboard",
        component: EmployeeDashboard,
        meta: { title: "Dashboard", authRequired: true },
      },
      {
        path: "profile",
        component: Profile,
        meta: { title: "My Profile", authRequired: true },
      },
      {
        path: "qr-scanner",
        component: ReadQrCode,
        meta: { title: "Read QR Code", authRequired: true },
      },
      {
        path: "qr-logs",
        component: LocatorsLog,
        meta: { title: "Locator Slip QR Logs", authRequired: true },
      },
    ],
  },
  //auditor
  {
    path: "/auditor",
    meta: { RouteForAuditor: true, authRequired: true },
    component: MainLayout,
    children: [
      {
        path: "/auditor",
        alias: "/auditor/dashboard",
        component: AuditorDashboard,
        meta: { title: "Dashboard", authRequired: true },
      },

      {
        path: "audit-ls",
        component: AuditLocatorSlip,
        meta: { title: "Locator Slip", authRequired: true },
      },
      {
        path: "audit-to",
        component: AuditTravelOrder,
        meta: { title: "Travel Orders", authRequired: true },
      },
      {
        path: "audit-dtr",
        component: AuditDTR,
        meta: { title: "DTR (Daily Time Record)", authRequired: true },
      },
      {
        path: "audit-leave",
        component: AuditLeave,
        meta: { title: "Leave of Absence", authRequired: true },
      },
    ],
  },
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
