import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { DataSource, Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubjectsService {

  constructor(private dataSource: DataSource,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ){}

 async create(createSubjectDto: CreateSubjectDto) {
  console.log(createSubjectDto)
    let posted_year = new Date().getFullYear();
    var date_year = posted_year.toString()
    try {
      let data = this.dataSource.manager.create(Subject,{
        subject_title: createSubjectDto.subject_title,
      seniorJunior:createSubjectDto.seniorJunior,
      grade_level:createSubjectDto.grade_level,
      date_from:createSubjectDto.date_from,
      date_to:createSubjectDto.date_to,
      posted_year:date_year
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

  async activeSubject(year:string){
    let data = await this.dataSource.manager.createQueryBuilder(Subject,'sub')
    .where('Date(now()) between Date(sub.date_from) and Date(sub.date_to)')
    .andWhere('posted_year = :year', {
      year: year,
    })
    .orderBy('created_at', 'DESC')
    .getMany()
    return data
  }

  async notActiveSubject(year:string){
    let data = await this.dataSource.manager.createQueryBuilder(Subject,'JP')
    .where('JP.id NOT IN (SELECT id FROM subject where Date(NOW()) between Date(date_from) and Date(date_to))')
    .andWhere('posted_year = :year', {
      year: year,
    })
    .orderBy('created_at', 'DESC')
    .getMany()
    return data

  }



  

  findAll() {
    return `This action returns all subjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subject`;
  }

  
  
  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    console.log(updateSubjectDto)
    let posted_year = new Date().getFullYear();
    // console.log(posted_year)
    var date_year = posted_year.toString()

try {
    this.dataSource.manager.update(Subject,id,{
    subject_title:updateSubjectDto.subject_title,
    grade_level: updateSubjectDto.grade_level,
    seniorJunior: updateSubjectDto.seniorJunior,
    date_from: updateSubjectDto.date_from,
    date_to: updateSubjectDto.date_to,
    posted_year:date_year
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
