import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { DataSource, Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';
import { TeacherSubject } from 'src/entities';

@Injectable()
export class SubjectsService {

  constructor(private dataSource: DataSource,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ){}

 async create(createSubjectDto: CreateSubjectDto) {
  console.log(createSubjectDto)
    
    try {
      let data = this.dataSource.manager.create(Subject,{
        subject_title: createSubjectDto.subject_title,
      seniorJunior:createSubjectDto.seniorJunior,
      grade_level:createSubjectDto.grade_level,
      date_from:createSubjectDto.date_from,
      date_to:createSubjectDto.date_to,
      school_yearId:createSubjectDto.school_yearId
      })

      await this.dataSource.manager.save(data)
      return{
        msg:'Save successfully!', status:HttpStatus.CREATED
      }
    } catch (error) {
      return{
        msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
      }
    }

  }

  async getSpicificSubject(filter:number, grade: string){
    let data = await this.dataSource.manager.createQueryBuilder(Subject,'sub')
    .where('Date(now()) between Date(sub.date_from) and Date(sub.date_to)')
    .andWhere('school_yearId = :school_yearId', {
      school_yearId: filter,
    })
    .andWhere('grade_level = :grade', {
      grade: grade,
    })
    .orderBy('created_at', 'DESC')
    .getMany()
    return data
  }

  async activeSubject(filter:number){
    let data = await this.dataSource.manager.createQueryBuilder(Subject,'sub')
    .where('Date(now()) between Date(sub.date_from) and Date(sub.date_to)')
    .andWhere('sub.school_yearId = :school_yearId', {
      school_yearId: filter,
    })
    .orderBy('created_at', 'DESC')
    .getMany()
    return data
  }

  

  async notActiveSubject(filter:number){
    let data = await this.dataSource.manager.createQueryBuilder(Subject,'JP')
    .where('JP.id NOT IN (SELECT id FROM subject where Date(NOW()) between Date(date_from) and Date(date_to))')
    .andWhere('school_yearId = :school_yearId', {
      school_yearId: filter,
    })
    .orderBy('created_at', 'DESC')
    .getMany()
    return data

  }



  async addTeachersSubject(createTeacherSubjectDto: CreateTeacherSubjectDto) {

    try {
      let subjectList = JSON.parse(createTeacherSubjectDto.subject_list)
      let removeSubjects = JSON.parse(createTeacherSubjectDto.removed_subjects)
      console.log(subjectList, removeSubjects.length,createTeacherSubjectDto.userID)
      if(removeSubjects.length>0){
        for (let i = 0; i < removeSubjects.length; i++) {
        
          await this.dataSource.manager.delete(TeacherSubject, removeSubjects[i].subjectListId)
        }
      }

      for (let i = 0; i < subjectList.length; i++) {
        if(!subjectList[i].subjectListId){
          let addStudent = this.dataSource.manager.create(TeacherSubject, {
            teachersId:createTeacherSubjectDto.userID,
            subjectId:subjectList[i].id,
        })
       
        await this.dataSource.manager.save(addStudent)
        }
      }
      return{
        msg:'Saved successfully!',
        status: HttpStatus.CREATED
      }

    } catch (error) {
      return{
        msg:'Something went wrong!',
        status: HttpStatus.CREATED
      }
    }
  }

  async getSubjectTaagged(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(TeacherSubject, 'ts')
      .select([
        "*",
        "ts.id as subjectListId",
            ])
      .leftJoin(Subject, 'su', 'su.id = ts.subjectId')
      .where('ts.teachersId = "'+id+'"')
      .getRawMany();
    return data;
  }
  
  update(id: number, updateSubjectDto: UpdateSubjectDto ) {

try {
    this.dataSource.manager.update(Subject,id,{
    subject_title:updateSubjectDto.subject_title,
    grade_level: updateSubjectDto.grade_level,
    seniorJunior: updateSubjectDto.seniorJunior,
    date_from: updateSubjectDto.date_from,
    date_to: updateSubjectDto.date_to,
    school_yearId:updateSubjectDto.school_yearId
  })
  return{
    msg:'Updated successfully!', status:HttpStatus.CREATED
  }
} catch (error) {
  return{
    msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
  }
}
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
