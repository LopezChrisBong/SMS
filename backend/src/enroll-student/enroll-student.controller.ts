import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { EnrollStudentService } from './enroll-student.service';
import { CreateEnrollStudentDto } from './dto/create-enroll-student.dto';
import { UpdateEnrollStudentDto } from './dto/update-enroll-student.dto';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAddStrandDto } from 'src/rooms-section/dto/update-add-strand.dto';
import { currentUser } from 'src/shared/jwtDecode';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

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


  @Get('FacultySchedule')
  FacultySchedule() {
    return this.enrollStudentService.FacultySchedule();
  }

  @Get('MySchedule')
  MySchedule(@Headers() headers,) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.MySchedule(curr_user);
  }
  @Get('getClassProgramm/:grade/:section')
  getMyCoreTime(@Param('grade') grade: string,@Param('section') section: string,) {
    return this.enrollStudentService.getClassProgramm(grade, +section);
  }


  @Patch('updateClassProgram/:id')
  update(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
    @Headers() headers,
  ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.updateClassProgram(+id, updateAvailabilityDto, curr_user);
  }




  @Delete('deleteAvailabilitySchedule/:id')
  remove(@Param('id') id: string) {
    return this.enrollStudentService.remove(+id);
  }

}
