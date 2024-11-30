import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EnrollStudentService } from './enroll-student.service';
import { CreateEnrollStudentDto } from './dto/create-enroll-student.dto';
import { UpdateEnrollStudentDto } from './dto/update-enroll-student.dto';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('enroll-student')
export class EnrollStudentController {
  constructor(private readonly enrollStudentService: EnrollStudentService) {}

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createEnrollStudentDto: CreateEnrollStudentDto) {
    return this.enrollStudentService.create(createEnrollStudentDto);
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


}
