import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnrollStudentDto } from './dto/create-enroll-student.dto';
import { UpdateEnrollStudentDto } from './dto/update-enroll-student.dto';
import { EnrollStudent } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EnrollStudentService {
  constructor(
    @InjectRepository(EnrollStudent)
    private readonly enrollStudentRepository: Repository<EnrollStudent>,
    private dataSource: DataSource,
  ) {}
  

  async create(createEnrollStudentDto: CreateEnrollStudentDto) {
   console.log('Enroll',createEnrollStudentDto)
   try {
    let applyStudent = this.enrollStudentRepository.create(createEnrollStudentDto);
    await this.enrollStudentRepository.save(applyStudent);
    return {
      msg: 'Saved successfully.',
      status: HttpStatus.CREATED,
    };
  } catch (error) {
    return {
      msg: 'Saving failed',
      status: HttpStatus.BAD_REQUEST,
    };
  }
  }

  async EnrollStudent() {
    let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select([
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name",
        'ES.id as id',
        'ES.fname as fname',
        'ES.mname as mname',
        'ES.lname as lname',
        'ES.seniorJunior as seniorJunior',
        
      ])
      .andWhere('ES.statusEnrolled = 0')
      .getRawMany();

      console.log(data)
    return data;
  }

  async EnrolledStudent() {
    let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select(["IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.fname, ' ',SUBSTRING(ES.mname, 1, 1) ,'. ',ES.lname) ,concat(ES.fname, ' ', ES.lname)) as name",
        'ES.id as id',
        'ES.fname as fname',
        'ES.mname as mname',
        'ES.lname as lname',
        'ES.seniorJunior as seniorJunior',
      ])
      .andWhere('ES.statusEnrolled = 1')
      .getRawMany();
    return data;
  }

  async updateEnrolledStudent(updateVS: UpdateEnrollStudentDto) {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
 
        await queryRunner.manager.update(EnrollStudent , Number(updateVS.id), {
          statusEnrolled: updateVS.statusEnrolled,
          grade_level: updateVS.grade_level,
          lrn: updateVS.lrn,
          good_moral: updateVS.good_moral,
          birth_certificate: updateVS.birth_certificate,
          form137a: updateVS.form137a,
          year_from: updateVS.year_from,
            year_to: updateVS.year_to,
        });
        await queryRunner.commitTransaction();
        return {
          msg: updateVS.update_type == 1 ? 'Student Enrolled.' : 'Student Updated.',
          status: HttpStatus.OK,
        };
      }
     catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: error,
        status: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await queryRunner.release();
    }
  
}


}
