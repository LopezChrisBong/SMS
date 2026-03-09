import { AssignedModule } from 'src/assigned-modules/entities/assigned-module.entity';
import { Users } from 'src/auth/entities/auth.entity';
import { Availability } from 'src/enroll-student/entities/availability.entity';
import { CallbackElementaryEnrollmentSummary } from 'src/enroll-student/entities/callback-elementary-enrollment-summary.entity';
import { CallbackEnrollmentSummary } from 'src/enroll-student/entities/callback-enrollment-summary.entity';
import { ElementaryEnrollmentSummary } from 'src/enroll-student/entities/elementary-enrollment-summary.entity';
import { EnrollStudent } from 'src/enroll-student/entities/enroll-student.entity';
import { EnrollmentSummary } from 'src/enroll-student/entities/enrollment-summary.entity';
import { SchoolYear } from 'src/enroll-student/entities/scholl-year.entity';
import { StudentEnrollmentHistory } from 'src/enroll-student/entities/student-history.entity';
import { AddStrand } from 'src/rooms-section/entities/add-strand.entity';
import { AddTracks } from 'src/rooms-section/entities/add-tracks.entity';
import { RoomsSection } from 'src/rooms-section/entities/rooms-section.entity';
import { StudentAttendance } from 'src/rooms-section/entities/student-attendance.entity';
import { StudentList } from 'src/rooms-section/entities/student-list.entity';
import { GradeLevel } from 'src/subjects/entities/grade-level.entity';
import { TeacherGradeLevel } from 'src/subjects/entities/prefered-grade-level.entity';
import { TeacherSubject } from 'src/subjects/entities/prefered-subject.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { SysModule } from 'src/sys-modules/entities/sys-module.entity';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import { UserType } from 'src/user-type/entities/user-type.entity';

const entities = [
  Users,
  UserDetail,
  UserType,
  UserRole,
  AssignedModule,
  SysModule,
  EnrollStudent,
  RoomsSection,
  AddTracks,
  AddStrand,
  Availability,
  SchoolYear,
  StudentList,
  TeacherSubject,
  Subject,
  TeacherGradeLevel,
  GradeLevel,
  StudentAttendance,
  EnrollmentSummary,
  ElementaryEnrollmentSummary,
  CallbackEnrollmentSummary,
  CallbackElementaryEnrollmentSummary,
  StudentEnrollmentHistory,
];

export {
  Users,
  UserDetail,
  UserType,
  UserRole,
  AssignedModule,
  SysModule,
  EnrollStudent,
  RoomsSection,
  AddTracks,
  AddStrand,
  Availability,
  SchoolYear,
  StudentList,
  TeacherSubject,
  Subject,
  TeacherGradeLevel,
  GradeLevel,
  StudentAttendance,
  EnrollmentSummary,
  ElementaryEnrollmentSummary,
  CallbackEnrollmentSummary,
  CallbackElementaryEnrollmentSummary,
  StudentEnrollmentHistory,
};

export default entities;
