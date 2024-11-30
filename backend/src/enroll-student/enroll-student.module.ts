import { Module } from '@nestjs/common';
import { EnrollStudentService } from './enroll-student.service';
import { EnrollStudentController } from './enroll-student.controller';
import { EnrollStudent } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EnrollStudent])],
  controllers: [EnrollStudentController],
  providers: [EnrollStudentService]
})
export class EnrollStudentModule {}
