import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EnrollStudentService } from './enroll-student.service';
import { CreateEnrollStudentDto } from './dto/create-enroll-student.dto';
import { UpdateEnrollStudentDto } from './dto/update-enroll-student.dto';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('enroll-student')
export class EnrollStudentController {
  constructor(private readonly enrollStudentService: EnrollStudentService) {}

  // @UseGuards(JWTAuthGuard)
  // @ApiBearerAuth()
  @Post()
  create(@Body() createEnrollStudentDto: CreateEnrollStudentDto) {
    return this.enrollStudentService.create(createEnrollStudentDto);
  }

  @Post('AddSchedule')
  AddSchedule(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    return this.enrollStudentService.AddSchedule(createAvailabilityDto);
  }

    // @UseGuards(JWTAuthGuard)
  // @ApiBearerAuth()
  @Post('updateEnrolledStudent')
  updateEnrolledStudent(@Body() updateVS: UpdateEnrollStudentDto) {
    return this.enrollStudentService.updateEnrolledStudent(updateVS);
  }




   // @UseGuards(JWTAuthGuard)
  // @ApiBearerAuth()
  @Get('EnrollStudent')
  EnrollStudent() {
    return this.enrollStudentService.EnrollStudent();
  }

  @Get('EnrolledStudent')
  EnrolledStudent() {
    return this.enrollStudentService.EnrolledStudent();
  }

  @Get('getClassProgramm/:grade/:section')
  getMyCoreTime(@Param('grade') grade: string,@Param('section') section: string,) {
    return this.enrollStudentService.getClassProgramm(grade, +section);
  }


}
