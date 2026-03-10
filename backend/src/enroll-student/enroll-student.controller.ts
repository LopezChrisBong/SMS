import {
  Controller,
  Res,
  Headers,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from 'src/shared/helper';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

@Controller('enroll-student')
export class EnrollStudentController {
  constructor(private readonly enrollStudentService: EnrollStudentService) {}

  // @UseGuards(JWTAuthGuard)
  // @ApiBearerAuth()
  @Post()
  create(@Body() createEnrollStudentDto: CreateEnrollStudentDto) {
    return this.enrollStudentService.create(createEnrollStudentDto);
  }

  @Post('/enrollStudentWithFile')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: Helper.student_files,
        filename: Helper.customFileName,
      }),
    }),
  )
  enrollStudentWithFile(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Request() request,
  ) {
    // console.log(files);
    // console.log(JSON.parse(request.body.body));
    const bodystring = JSON.parse(request.body.body);
    return this.enrollStudentService.enrollStudentWithFile(bodystring, files);
  }

  @Patch('/updateStudentWithFile/:id')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: Helper.student_files,
        filename: Helper.customFileName,
      }),
    }),
  )
  async updateStudentWithFile(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('body') body: string,
  ) {
    try {
      const parsedBody = JSON.parse(body);

      return await this.enrollStudentService.updateStudentWithFile(
        +id,
        parsedBody,
        files,
      );
    } catch (error) {
      throw new BadRequestException('Invalid request format.');
    }
  }

  @Post('/update-student-file')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: Helper.student_files,
        filename: Helper.customFileName,
      }),
    }),
  )
  async update_student_file(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Request() request,
  ) {
    const bodystring = JSON.parse(request.body.body);
    return this.enrollStudentService.update_student_file(bodystring, files);
  }

  @Post('getArrayFile')
  async getArrayFile(@Body() deleteFileArray: any) {
    console.log(deleteFileArray);
    let fileToDelete = deleteFileArray;
    for (let index = 0; index < fileToDelete.length; index++) {
      const element = fileToDelete[index];
      await this.deleteFile(element);
    }
  }

  @Delete('deleteApplicantsFile/:fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    fs.unlink('student_file/' + fileName, (err) => {
      // fs.unlink('/../student_file/' + fileName, (err) => {
      if (err) {
        console.error(err);
        return err;
      }
      console.log('Deleted File');
      return {
        msg: 'Successfully deleted!',
        status: HttpStatus.OK,
      };
    });
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
  EnrollStudent(@Headers() headers) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.EnrollStudent(curr_user);
  }

  @Get('EnrolledStudent')
  EnrolledStudent(@Headers() headers) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.EnrolledStudent(curr_user);
  }

  @Get('AddClassStudent/EnrolledStudent/:grade')
  AddClassStudent(@Param('grade') grade: string) {
    return this.enrollStudentService.AddClassStudent(grade);
  }

  @Get('getTotalEnrolledStudent/:filter/:status/:gradeLevel')
  getTotalEnrolledStudent(
    @Param('filter') filter: string,
    @Param('status') status: string,
    @Param('gradeLevel') gradeLevel: string,
  ) {
    return this.enrollStudentService.getTotalEnrolledStudent(
      +filter,
      +status,
      gradeLevel,
    );
  }

  @Get('getStudentDataByCode/:filter/:code/:level')
  getStudentDataByCode(
    @Param('filter') filter: string,
    @Param('code') code: string,
    @Param('level') level: string,
  ) {
    return this.enrollStudentService.getStudentDataByCode(+filter, code, level);
  }

  // @Get('studentPortalLogin/:firstName/:lastName/:birthDate/:LRN/:Code')
  @Get('studentPortalLogin/:birthDate/:LRN')
  studentPortalLogin(
    // @Param('firstName') firstName: string,
    // @Param('lastName') lastName: string,
    @Param('birthDate') birthDate: string,
    @Param('LRN') LRN: string,
    // @Param('Code') Code: string,
  ) {
    return this.enrollStudentService.studentPortalLogin(
      // firstName,
      // lastName,
      birthDate,
      LRN,
      // Code,
    );
  }

  @Get('FacultySchedule/:filter')
  FacultySchedule(@Param('filter') filter: string, @Headers() headers) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.FacultySchedule(+filter, curr_user);
  }

  @Get('getSchoolYear')
  getSchoolYear() {
    return this.enrollStudentService.getSchoolYear();
  }

  @Get('getSchoolYear/toGenerate/:grade/:filter')
  getSchoolYearGenerate(
    @Param('grade') grade: string,
    @Param('filter') filter: string,
  ) {
    return this.enrollStudentService.getSchoolYearGenerate(grade, +filter);
  }

  @Get('getDataForForcastingHighSchool')
  async getDataForForcastingHighSchool() {
    return this.enrollStudentService.getDataForForcastingHighSchool();
  }

  @Get('getEnrollmentChart/:sy')
  getChart(@Param('sy') sy: number, @Query('levelType') levelType: string) {
    return this.enrollStudentService.getEnrollmentChart(sy, levelType);
  }

  @Get('getDataForForcastingElementary')
  async getDataForForcastingElementary() {
    return this.enrollStudentService.getDataForForcastingElementary();
  }

  @Get('MySchedule/:filter')
  MySchedule(@Headers() headers, @Param('filter') filter: string) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.MySchedule(curr_user, +filter);
  }

  @Get('getStudentSchedule/:studentID')
  getStudentSchedule(@Param('studentID') studentID: string) {
    return this.enrollStudentService.getStudentSchedule(+studentID);
  }

  @Get('getCombinedForecasts')
  getCombinedForecasts() {
    return this.enrollStudentService.getCombinedForecasts();
  }

  @Get('getTeacherRoomNeedForecasts')
  getTeacherRoomNeedForecasts() {
    return this.enrollStudentService.getTeacherRoomNeedForecasts();
  }

  @Get('getClassProgramm/:grade/:section/:filter')
  getMyCoreTime(
    @Param('grade') grade: string,
    @Param('section') section: string,
    @Param('filter') filter: string,
  ) {
    return this.enrollStudentService.getClassProgramm(grade, +section, +filter);
  }

  @Get('checkConflict/:data')
  checkConflict(@Param('data') data: string) {
    return this.enrollStudentService.checkConflict(data);
  }

  @Get('view/studentFile/:data')
  getFile(
    @Param('data') data: string,
    @Res({ passthrough: true }) res,
  ): StreamableFile {
    let content_type = '';
    // console.log(data)
    let datasplited = data.split('.');
    if (datasplited[datasplited.length - 1] == 'jpeg') {
      content_type = 'image/jpeg';
    } else if (datasplited[datasplited.length - 1] == 'jpg') {
      content_type = 'image/jpg';
    } else if (datasplited[datasplited.length - 1] == 'png') {
      content_type = 'image/png';
    } else if (datasplited[datasplited.length - 1] == 'pdf') {
      content_type = 'application/pdf';
    } else if (datasplited[datasplited.length - 1] == 'mp4') {
      content_type = 'video/mp4';
    } else if (datasplited[datasplited.length - 1] == 'avi') {
      content_type = 'video/x-msvideo';
    } else if (datasplited[datasplited.length - 1] == 'mov') {
      content_type = 'video/quicktime';
    } else if (datasplited[datasplited.length - 1] == 'wmv') {
      content_type = 'video/x-ms-wmv';
    } else if (datasplited[datasplited.length - 1] == '3gp') {
      content_type = 'video/3gpp';
    } else if (datasplited[datasplited.length - 1] == 'flv') {
      content_type = 'video/x-flv';
    } else if (datasplited[datasplited.length - 1] == 'doc') {
      content_type = 'application/msword';
    }

    const file = createReadStream(
      // join(process.cwd(), '/student_file/' + data),
      join(process.cwd(), '/../student_file/' + data),
    );
    res.set({
      'Content-Type': content_type,
    });
    return new StreamableFile(file);
  }

  @Patch('updateClassProgram/:id')
  update(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
    @Headers() headers,
  ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.updateClassProgram(
      +id,
      updateAvailabilityDto,
      curr_user,
    );
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

  @Post('generate')
  async generate() {
    return this.enrollStudentService.generateSummary();
  }

  @Post('generateElementary')
  async generateElementary() {
    return this.enrollStudentService.generateSummaryElementary();
  }
}
