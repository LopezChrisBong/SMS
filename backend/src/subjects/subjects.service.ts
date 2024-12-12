import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { DataSource, Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';
import { GradeLevel, TeacherGradeLevel, TeacherSubject } from 'src/entities';
import { CreateTeacherGradeLevelDto } from './dto/create-teacher-gradeLevel.dto';

@Injectable()
export class SubjectsService {

  constructor(private dataSource: DataSource,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ){}

 async create(createSubjectDto: CreateSubjectDto) {
    
    try {
      let data = this.dataSource.manager.create(Subject,{
        subject_title: createSubjectDto.subject_title,
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

  async getSpicificSubject(id:number,filter:number, grade: string){
    // console.log(user.userdetail.id)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const count = await queryRunner.query(
      'SELECT COUNT(*) as count FROM teacher_subject where teachersId ="'+id+'"',
    );
    console.log(count[0].count)
    if(count[0].count != 0){
    let data =  this.getSubjectTaagged(id)
              await queryRunner.release();
              return data
    }

    let data = await this.dataSource.manager.createQueryBuilder(Subject,'sub')
    // .where('Date(now()) between Date(sub.date_from) and Date(sub.date_to)')
    // .andWhere('school_yearId = :school_yearId', {
    //   school_yearId: filter,
    // })
    // .andWhere('seniorJunior = :seniorJunior', {
    //   seniorJunior: grade,
    // })
    .orderBy('created_at', 'DESC')
    .getMany()
    await queryRunner.release();
    return data
  }

  async activeSubject(){
    let data = await this.dataSource.manager.createQueryBuilder(Subject,'sub')
    // .where('Date(now()) between Date(sub.date_from) and Date(sub.date_to)')
    .orderBy('subject_title', 'ASC')
    .getMany()
    return data
  }

  

  async notActiveSubject(){
    let data = await this.dataSource.manager.createQueryBuilder(Subject,'JP')
    // .where('JP.id NOT IN (SELECT id FROM subject where Date(NOW()) between Date(date_from) and Date(date_to))')
    .orderBy('subject_title', 'ASC')
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
          let addSubject = this.dataSource.manager.create(TeacherSubject, {
            teachersId:createTeacherSubjectDto.userID,
            subjectId:subjectList[i].id,
        })
       
        await this.dataSource.manager.save(addSubject)
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

  async addTeachersGradeLevel(createTeacherGradeLevelDto: CreateTeacherGradeLevelDto) {

    try {
      let gradeLevel_list = JSON.parse(createTeacherGradeLevelDto.gradeLevel_list)
      let removed_gradeLevel = JSON.parse(createTeacherGradeLevelDto.removed_gradeLevel)
      // console.log(gradeLevel_list, removed_gradeLevel,createTeacherGradeLevelDto.userID)
      if(removed_gradeLevel.length>0){
        for (let i = 0; i < removed_gradeLevel.length; i++) {
        
          await this.dataSource.manager.delete(TeacherGradeLevel, removed_gradeLevel[i].gradeListId)
        }
      }

      for (let i = 0; i < gradeLevel_list.length; i++) {
        if(!gradeLevel_list[i].gradeListId){
          let addGrade = this.dataSource.manager.create(TeacherGradeLevel, {
            teachersId:createTeacherGradeLevelDto.userID,
            grade_level:gradeLevel_list[i].id,
        })
        console.log('Grade',addGrade)
        await this.dataSource.manager.save(addGrade)
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


  async getGradeTaagged(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(TeacherGradeLevel, 'tg')
      .select([
        "*",
        "tg.id as gradeListId",
            ])
      .leftJoin(GradeLevel, 'g', 'g.id = tg.grade_level')
      .where('tg.teachersId = "'+id+'"')
      .getRawMany();
    return data;
  }
  
  
  update(id: number, updateSubjectDto: UpdateSubjectDto ) {

try {
    this.dataSource.manager.update(Subject,id,{
    subject_title:updateSubjectDto.subject_title,
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
