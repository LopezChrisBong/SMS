import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomsSectionService } from './rooms-section.service';
import { CreateRoomsSectionDto } from './dto/create-rooms-section.dto';
import { UpdateRoomsSectionDto } from './dto/update-rooms-section.dto';
import { CreateAddTrackDto } from './dto/create-add-track.dto';
import { UpdateAddTrackDto } from './dto/update-add-track.dto';
import { CreateAddStrandDto } from './dto/create-add-strand.dto';
import { UpdateAddStrandDto } from './dto/update-add-strand.dto';
import { CreateStudentListDto } from './dto/create-student-list.dto';
import { CreateAddStudentRoomDto } from './dto/create-add-student-room.dto';
import { CreateStudentAttendanceDto } from './dto/create-student-attendance.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student-attendance.dto';

@Controller('rooms-section')
export class RoomsSectionController {
  constructor(private readonly roomsSectionService: RoomsSectionService) {}

  @Post()
  create(@Body() createRoomsSectionDto: CreateRoomsSectionDto) {
    return this.roomsSectionService.create(createRoomsSectionDto);
  }

  @Post('addTrack')
  addTrack(@Body() createAddTrackDto: CreateAddTrackDto) {
    return this.roomsSectionService.addTrack(createAddTrackDto);
  }

  @Post('addStrand')
  addStrand(@Body() createAddStrandDto: CreateAddStrandDto) {
    return this.roomsSectionService.addStrand(createAddStrandDto);
  }

  @Post('generateClassRecord/byGrade/level/:grade/:filter')
  generateClassRecord(@Param('grade') grade: string,@Param('filter') filter: string) {
    return this.roomsSectionService.generateClassRecord(grade, +filter);
  }

  @Post('genStrandRecord/seniorHigh/:grade/:filter/:strand')
  genStrandRecord(@Param('grade') grade: string,@Param('filter') filter: string, @Param('strand') strand: string) {
    return this.roomsSectionService.genStrandRecord(grade, +filter ,+strand);
  }

  @Post('updateAddRecords/:grade/:sy/:room')
  updateAddRecords(@Body() createStudentListDto: CreateStudentListDto,@Param('grade') grade: string,@Param('sy') sy: string,@Param('room') room: string) {
    return this.roomsSectionService.updateAddRecords(createStudentListDto, grade, +sy, +room );
  }

  @Post('addStudentClassRoom')
  addStudentClassRoom(@Body() createAddStudentRoomDto: CreateAddStudentRoomDto) {
    return this.roomsSectionService.addStudentClassRoom(createAddStudentRoomDto);
  }

    @Post('studentAttendance')
  studentAttendance(@Body() createStudentAttendanceDto:CreateStudentAttendanceDto) {
    return this.roomsSectionService.studentAttendance(createStudentAttendanceDto);
  }

    @Get('getAllAttendanceByDate/:date/:roomID/:subjectID')
  getAllAttendanceByDate(@Param('date') date: string,@Param('roomID') roomID: string,@Param('subjectID') subjectID: string) {
    return this.roomsSectionService.getAllAttendanceByDate(date,+roomID,+subjectID);
  }


  
  @Get(':gradeLevel')
  findAll(@Param('gradeLevel') gradeLevel: string) {
    return this.roomsSectionService.findAll(gradeLevel);
  }

  @Get(':gradeLevel/:section')
  findSectionName(@Param('gradeLevel') gradeLevel: string,@Param('section') section: string) {
    return this.roomsSectionService.findSectionName(gradeLevel,+section);
  }


  
  @Get('getAlltracks/Data/tracks')
  getAlltracks() {

    return this.roomsSectionService.getAlltracks();
  }

  @Get('getCountGen/:grade/:filter')
  getCountGen(@Param('grade') grade: string,@Param('filter') filter: string) {

    return this.roomsSectionService.getCountGen(grade, +filter);
  }

  @Get('getConflictStrand/:grade/:filter/:strand')
  getConflictStrand(@Param('grade') grade: string,@Param('filter') filter: string ,@Param('strand') strand: string) {

    return this.roomsSectionService.getConflictStrand(grade, +filter, +strand);
  }
    @Get('getMyStudentAttendance/:id/:filter/:roomID')
  getMyStudentAttendance(@Param('id') id: string,@Param('filter') filter: string,@Param('roomID') roomID: string) {
  return this.roomsSectionService.getMyStudentAttendance(+id, +filter, +roomID);
  }

  @Get('getRoomClassList/:id/:grade/:filter')
  getRoomClassList(@Param('id') id: string,@Param('grade') grade: string,@Param('filter') filter: string) {

    return this.roomsSectionService.getRoomClassList(+id, grade, +filter);
  }



  @Get('AllStrand/Data/strand')
  AllStrand() {
    return this.roomsSectionService.AllStrand();
  }

  @Get('AllStrand/Enroll/:id')
  AllStrandEnroll(@Param('id') id: string) {
    return this.roomsSectionService.AllStrandEnroll(+id);
  }
 
 
      @Get('getAllAttendanceWholeSemester/:roomID/:subjectID')
  getAllAttendanceWholeSemester(@Param('roomID') roomID: string,@Param('subjectID') subjectID: string) {
    return this.roomsSectionService.getAllAttendanceWholeSemester(+roomID,+subjectID);
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsSectionService.findOne(+id);
  }
  
   @Patch('updateAttendance/:date')
  updateAttendance(@Param('date') date: string, @Body() updateStudentAttendanceDto: UpdateStudentAttendanceDto) {
    return this.roomsSectionService.updateAttendance(date, updateStudentAttendanceDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomsSectionDto: UpdateRoomsSectionDto) {
    return this.roomsSectionService.update(+id, updateRoomsSectionDto);
  }

  @Patch('updateTrack/:id')
  updateTrack(@Param('id') id: string, @Body() updateAddTrackDto: UpdateAddTrackDto) {
    return this.roomsSectionService.updateTrack(+id, updateAddTrackDto);
  }

  @Patch('updateStrand/:id')
  updateStrand(@Param('id') id: string, @Body() updateAddStrandDto: UpdateAddStrandDto) {
    return this.roomsSectionService.updateStrand(+id, updateAddStrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsSectionService.remove(+id);
  }
}
