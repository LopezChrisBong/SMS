
import { AssignedModule } from 'src/assigned-modules/entities/assigned-module.entity';
import { Users } from 'src/auth/entities/auth.entity';
import { EnrollStudent } from 'src/enroll-student/entities/enroll-student.entity';
import { AddStrand } from 'src/rooms-section/entities/add-strand.entity';
import { AddTracks } from 'src/rooms-section/entities/add-tracks.entity';
import { RoomsSection } from 'src/rooms-section/entities/rooms-section.entity';
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
  Subject,
  RoomsSection,
  AddTracks,
  AddStrand
];

export {
  Users,
  UserDetail,
  UserType,
  UserRole,
  AssignedModule,
  SysModule,
  EnrollStudent,
  Subject,
  RoomsSection,
  AddTracks,
  AddStrand
};

export default entities;
