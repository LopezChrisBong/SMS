import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnrollStudentDto } from './dto/create-enroll-student.dto';
import { UpdateEnrollStudentDto } from './dto/update-enroll-student.dto';
import { Availability, EnrollStudent, RoomsSection, Subject, UserDetail } from 'src/entities';
import { Brackets, DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class EnrollStudentService {
  constructor(
    @InjectRepository(EnrollStudent)
    private readonly enrollStudentRepository: Repository<EnrollStudent>,
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    private dataSource: DataSource,
  ) {}
  

  async create(createEnrollStudentDto: CreateEnrollStudentDto) {
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

  async AddSchedule(createAvailabilityDto: CreateAvailabilityDto) {
    try {
      // Check for conflicts
      const conflict = await this.checkConflict(createAvailabilityDto);
  
      if (conflict) {
        console.log('Conflict')
        // return {
        //   msg: 'Conflict detected. Schedule cannot be added.',
        //   status: HttpStatus.CONFLICT,
        //   conflictDetails: conflict,
        // };
      }
      else{
          console.log('Save')
      }
    
  
      // Save the schedule
      // const newSchedule = this.availabilityRepository.create(createAvailabilityDto);
      // await this.availabilityRepository.save(newSchedule);
  
      // return {
      //   msg: 'Schedule added successfully.',
      //   status: HttpStatus.CREATED,
      // };
    } catch (error) {
      console.error('Error adding schedule:', error);
      return {
        msg: 'Failed to add schedule.',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
  
  async checkConflict(data: CreateAvailabilityDto): Promise<any> {
    try {
      const conflicts = await this.availabilityRepository
        .createQueryBuilder('availability')
        .where('availability.teacherID = :teacherID', { teacherID: data.teacherID })
        .andWhere('availability.day = :day', { day: data.day })
        .andWhere('availability.roomId = :roomId', { roomId: data.roomId })
        .andWhere('availability.subjectId = :subjectId', { subjectId: data.subjectId })
        .andWhere(
          new Brackets((qb) => {
            qb.where(':from BETWEEN availability.times_slot_from AND availability.times_slot_to', { from: data.times_slot_from })
              .orWhere(':to BETWEEN availability.times_slot_from AND availability.times_slot_to', { to: data.times_slot_to })
              .orWhere(
                'availability.times_slot_from BETWEEN :from AND :to',
                { from: data.times_slot_from, to: data.times_slot_to }
              );
          })
        )
        .getMany();
  
      return conflicts.length > 0 ? conflicts : null;
    } catch (error) {
      console.error('Error checking conflict:', error);
      throw error;
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
        'ES.suffix as suffix',
        'ES.email as email',
        'ES.bdate as bdate',
        'ES.birth_place as birth_place',
        'ES.sex as sex',
        'ES.civil_status as civil_status',
        'ES.transfered as transfered ',
        'ES.height as height',
        'ES.weight as weight',
        'ES.is_IP as is_IP ',
        'ES.ip_Name as ip_Name',
        'ES.fourPs as fourPs',
        'ES.fourpis as fourpis',
        'ES.disability as disability ',
        'ES.disability_desc as disability_desc',
        'ES.blood_type as blood_type',
        'ES.isFilipino as isFilipino',
        'ES.mobile_no as mobile_no',
        'ES.residential_zip as residential_zip',
        'ES.residential_house_no as residential_house_no',
        'ES.residential_street as residential_street',
        'ES.residential_subd as residential_subd',
        'ES.residential_brgy as residential_brgy',
        'ES.residential_city as residential_city',
        'ES.residential_prov as residential_prov',
        'ES.permanent_zip as permanent_zip',
        'ES.permanent_house_no as permanent_house_no',
        'ES.permanent_street as permanent_street',
        'ES.permanent_subd as permanent_subd',
        'ES.permanent_brgy as permanent_brgy',
        'ES.permanent_city as permanent_city',
        'ES.permanent_prov as permanent_prov',
        'ES.father_fname as father_fname',
        'ES.father_mname as father_mname',
        'ES.father_lname as father_lname',
        'ES.father_number as father_number',
        'ES.mother_fname as mother_fname',
        'ES.mother_mname as mother_mname',
        'ES.mother_lname as mother_lname',
        'ES.mother_number as mother_number',
        'ES.guardian_fname as guardian_fname',
        'ES.guardian_mname as guardian_mname',
        'ES.guardian_lname as guardian_lname',
        'ES.guardian_number as guardian_number',
        'ES.last_grade_completed  as last_grade_completed',
        'ES.last_year_completed  as last_year_completed',
        'ES.last_school_attended  as last_school_attended',
        'ES.last_school_ID  as last_school_ID',
        'ES.track  as track',
        'ES.semester  as track',
        'ES.strand  as track',
        
      ])
      .andWhere('ES.statusEnrolled = 0')
      .getRawMany();

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
        'ES.suffix as suffix',
        'ES.email as email',
        'ES.bdate as bdate',
        'ES.birth_place as birth_place',
        'ES.sex as sex',
        'ES.civil_status as civil_status',
        'ES.transfered as transfered ',
        'ES.height as height',
        'ES.weight as weight',
        'ES.is_IP as is_IP ',
        'ES.ip_Name as ip_Name',
        'ES.fourPs as fourPs',
        'ES.fourpis as fourpis',
        'ES.disability as disability ',
        'ES.disability_desc as disability_desc',
        'ES.blood_type as blood_type',
        'ES.isFilipino as isFilipino',
        'ES.mobile_no as mobile_no',
        'ES.residential_zip as residential_zip',
        'ES.residential_house_no as residential_house_no',
        'ES.residential_street as residential_street',
        'ES.residential_subd as residential_subd',
        'ES.residential_brgy as residential_brgy',
        'ES.residential_city as residential_city',
        'ES.residential_prov as residential_prov',
        'ES.permanent_zip as permanent_zip',
        'ES.permanent_house_no as permanent_house_no',
        'ES.permanent_street as permanent_street',
        'ES.permanent_subd as permanent_subd',
        'ES.permanent_brgy as permanent_brgy',
        'ES.permanent_city as permanent_city',
        'ES.permanent_prov as permanent_prov',
        'ES.father_fname as father_fname',
        'ES.father_mname as father_mname',
        'ES.father_lname as father_lname',
        'ES.father_number as father_number',
        'ES.mother_fname as mother_fname',
        'ES.mother_mname as mother_mname',
        'ES.mother_lname as mother_lname',
        'ES.mother_number as mother_number',
        'ES.guardian_fname as guardian_fname',
        'ES.guardian_mname as guardian_mname',
        'ES.guardian_lname as guardian_lname',
        'ES.guardian_number as guardian_number',
        'ES.last_grade_completed  as last_grade_completed',
        'ES.last_year_completed  as last_year_completed',
        'ES.last_school_attended  as last_school_attended',
        'ES.last_school_ID  as last_school_ID',
        'ES.track  as track',
        'ES.semester  as track',
        'ES.strand  as track',
        'ES.lrn as lrn',
        'ES.good_moral as good_moral',
        'ES.birth_certificate as birth_certificate',
        'ES.form137a as form137a',
        'ES.year_from as year_from',
          'ES.grade_level as grade_level',
          'ES.year_to as year_to',
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

async getClassProgramm(grade: string , section : number ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const toReturn = await queryRunner.query(
      '  SELECT  CONCAT(t1.times_slot_from,  " - ", t1.times_slot_to) AS time ,CONCAT(t2.lname,  " ,", t2.fname) AS name,  t1.*, t2.*, t3.*, t4.* FROM availability t1 LEFT JOIN user_detail t2 ON t1.teacherID = t2.id LEFT JOIN rooms_section t3 ON t1.roomId = t3.id LEFT JOIN subject t4 ON t1.subjectId = t4.id where t1.grade_level = "'+ grade +'" and t1.roomId ="'+section+'" order by t1.day ASC' ,      
    );
    await queryRunner.release();
    return toReturn;


}


}
