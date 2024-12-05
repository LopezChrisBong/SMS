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
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';

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

  

  @Post('addSchoolYear')
  addSchoolYear(@Body() createSchoolYearDto: CreateSchoolYearDto) {
    return this.enrollStudentService.addSchoolYear(createSchoolYearDto);
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

  @Get('AddClassStudent/EnrolledStudent/:grade')
  AddClassStudent(@Param('grade') grade: string,) {
    return this.enrollStudentService.AddClassStudent(grade);
  }




  @Get('FacultySchedule/:filter')
  FacultySchedule(@Param('filter') filter: string,) {
    return this.enrollStudentService.FacultySchedule(+filter);
  }

    @Get('getSchoolYear')
    getSchoolYear() {
    return this.enrollStudentService.getSchoolYear();
  }

  @Get('getSchoolYear/toGenerate/:grade/:filter')
  getSchoolYearGenerate(@Param('grade') grade: string,@Param('filter') filter: string,) {
  return this.enrollStudentService.getSchoolYearGenerate(grade,+filter);
}


  @Get('MySchedule/:filter')
  MySchedule(@Headers() headers,@Param('filter') filter: string,) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.MySchedule(curr_user,+filter);
  }
  @Get('getClassProgramm/:grade/:section/:filter')
  getMyCoreTime(@Param('grade') grade: string,@Param('section') section: string,@Param('filter') filter: string,) {
    return this.enrollStudentService.getClassProgramm(grade, +section,+filter);
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

  
  @Patch('updateSchoolYear/:id')
  updateSchoolYear(
    @Param('id') id: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto,
    // @Headers() headers,
  ) {
    // var head_str = headers.authorization;
    // const curr_user = currentUser(head_str);
    return this.enrollStudentService.updateSchoolYear(+id, updateSchoolYearDto);
  }




  @Delete('deleteAvailabilitySchedule/:id')
  remove(@Param('id') id: string) {
    return this.enrollStudentService.remove(+id);
  }

}
