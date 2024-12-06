import { Controller, Get, Post, Body, Patch, Param, Delete,Headers } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';
import { currentUser } from 'src/shared/jwtDecode';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post('')
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Post('addTeachersSubject')
  addTeachersSubject(@Body() createTeacherSubjectDto: CreateTeacherSubjectDto) {
    return this.subjectsService.addTeachersSubject(createTeacherSubjectDto);
  }

  @Get('getSubject/active/:filter')
  activeSubject(@Param('filter') filter: string) {
    return this.subjectsService.activeSubject(+filter);
  }
  

  @Get('CreateSubject/notActive/:filter')
  notActiveSubject(@Param('filter') filter: string) {
    return this.subjectsService.notActiveSubject(+filter);
  }
  @Get('getSubjectTaagged/:id')
  getSubjectTaagged(@Param('id') id: string) {
    return this.subjectsService.getSubjectTaagged(+id);
  }

  @Get('getSpicificSubject/:id/:filter/:grade')
  getSpicificSubject(
    // @Headers() headers, 
    @Param('id') id: string,
    @Param('filter') filter: string,
    @Param('grade') grade: string) {
    // var head_str = headers.authorization;
    // const curr_user = currentUser(head_str);
    return this.subjectsService.getSpicificSubject(+id,+filter,grade);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto,) {
    return this.subjectsService.update(+id, updateSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
  }
}
