import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnrollStudentDto } from './dto/create-enroll-student.dto';
import { UpdateEnrollStudentDto } from './dto/update-enroll-student.dto';
import { Availability, EnrollStudent, RoomsSection, Subject, UserDetail } from 'src/entities';
import { Brackets, DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { SchoolYear } from './entities/scholl-year.entity';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';

@Injectable()
export class EnrollStudentService {
  constructor(
    @InjectRepository(EnrollStudent)
    private readonly enrollStudentRepository: Repository<EnrollStudent>,
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    @InjectRepository(SchoolYear)
    private readonly schooyearRepository: Repository<SchoolYear>,
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

  async addSchoolYear(createSchoolYearDto: CreateSchoolYearDto) {
    try {
     let addYear = this.schooyearRepository.create(createSchoolYearDto);
     await this.schooyearRepository.save(addYear);
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
        return {
          msg: 'Conflict detected. Schedule cannot be added.',
          status: HttpStatus.CONFLICT,
          conflictDetails: conflict,
        };
      }


      // Save the schedule
      const newSchedule = this.availabilityRepository.create(createAvailabilityDto);
      await this.availabilityRepository.save(newSchedule);
  
      return {
        msg: 'Schedule added successfully.',
        status: HttpStatus.CREATED,
      };
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
        .where('availability.day = :day', { day: data.day })
        .andWhere(
          new Brackets((qb) => {

            // Dili mag repeat ang subject in the same room per day
            qb.where('availability.roomId = :roomId AND availability.subjectId = :subjectId', {
              roomId: data.roomId,
              subjectId: data.subjectId,
            });
  
            // No overlapping of time slots in the same room per day
            qb.orWhere(
              'availability.roomId = :roomId AND :from < availability.times_slot_to AND :to > availability.times_slot_from',
              { roomId: data.roomId, from: data.times_slot_from, to: data.times_slot_to }
            );
  
            // No duplicate subjects across different faculty or rooms per day
            qb.orWhere('availability.subjectId = :subjectId', { subjectId: data.subjectId });
  
            // Dapat walay conflicts ang faculty in time slots per room per day
            qb.orWhere(
              'availability.teacherID = :teacherID AND :from < availability.times_slot_to AND :to > availability.times_slot_from',
              { teacherID: data.teacherID, from: data.times_slot_from, to: data.times_slot_to }
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
  
  async EnrollStudent(curr_user:any) {


    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="'+curr_user.userdetail.id+'"',
    );

    let school_level;
    let school_level1;
    if(user[0].status == 1){
      school_level = 'Elementary'
      school_level1 = 'Primary'
     
    }
    else{
      school_level = 'Junior High'
      school_level1 = 'Senior High'
    }


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
        'ES.picture as picture',
        'ES.goodMoral as goodMoral',
        'ES.birthPSA as birthPSA',
        'ES.schoolCard as schoolCard',
        'ES.semester  as track',
        'ES.strand  as track',
        
      ])
      .where('ES.statusEnrolled = 0')
      .andWhere('ES.seniorJunior IN (:...values)', {
        values: [school_level, school_level1],
      })
      .getRawMany();

    return data;
  }

  async EnrolledStudent(curr_user:any) {
   

    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="'+curr_user.userdetail.id+'"',
    );

    let school_level;
    let school_level1;
    if(user[0].status == 1){
      school_level = 'Elementary'
      school_level1 = 'Primary'
     
    }
    else{
      school_level = 'Junior High'
      school_level1 = 'Senior High'
    }
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
        'ES.picture as picture',
        'ES.goodMoral as goodMoral',
        'ES.birthPSA as birthPSA',
        'ES.schoolCard as schoolCard',
        'ES.school_yearId as school_yearId',
        'ES.grade_level as grade_level',
        'ES.updated_at as updated_at',
      ])
      .andWhere('ES.statusEnrolled = 1')
      .andWhere('ES.seniorJunior IN (:...values)', {
        values: [school_level, school_level1],
      })
      .getRawMany();
    return data;
  }

  async AddClassStudent(grade:string) {
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
        'ES.picture as picture',
        'ES.goodMoral as goodMoral',
        'ES.birthPSA as birthPSA',
        'ES.schoolCard as schoolCard',
        'ES.school_yearId as school_yearId',
          'ES.grade_level as grade_level',
      ])
      .where('ES.statusEnrolled = 1')
      .andWhere('ES.grade_level = "'+grade+'"')
      .getRawMany();
    return data;
  }

  async FacultySchedule(filter:number, curr_user:any) {


    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="'+curr_user.userdetail.id+'"',
    );
    let data = await this.dataSource.manager
      .createQueryBuilder(Availability, 'A')
      .select([
        "A.id as id",
        "CONCAT(times_slot_from, ' - ', times_slot_to) AS time",
        "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
        "MAX(CASE WHEN day = 'Monday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ', room.room_section) END) AS Monday",
        "MAX(CASE WHEN day = 'Tuesday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Tuesday",
        "MAX(CASE WHEN day = 'Wednesday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Wednesday",
        "MAX(CASE WHEN day = 'Thursday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Thursday",
        "MAX(CASE WHEN day = 'Friday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Friday",
        "MAX(CASE WHEN day = 'Saturday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Saturday"

      ])
      .leftJoin(RoomsSection, 'room', 'room.id = A.roomId')
      .leftJoin(Subject, 'sub', 'sub.id = A.subjectId')
      .leftJoin(UserDetail, 'ud', 'ud.id = A.teacherID')
      .where('A.school_yearId = "'+filter+'"')
      // .andWhere('ud.status = "'+user[0].status+'"')
      .groupBy('A.times_slot_from,A.times_slot_to,A.teacherID')
      // .orderBy('A.teacherID, ud.lname')
      .orderBy('A.roomId')
      .getRawMany();
    return data;
  }

  async getSchoolYear() {
    let data = await this.dataSource.manager
      .createQueryBuilder(SchoolYear, 'A')
      .select([
        "*",
        "CONCAT(school_year_from, ' - ', school_year_to) AS school_year",
       "CONCAT(school_year_from, '-06-01') as startDate,CONCAT(school_year_to, '-05-31') as endDate"
      ])
      .getRawMany();

    return data;
  }

  async getSchoolYearGenerate(grade:string,filter:number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select([
        "COUNT(*) as conflict",
      ])
      .where('grade_level = "'+grade+'"')
      .andWhere('school_yearId = "'+filter+'"')
      .getRawMany();
    return data;
  }

  async MySchedule(user:any, filter:number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(Availability, 'A')
      .select([
        "A.id as id",
        "CONCAT(times_slot_from, ' - ', times_slot_to) AS time",
        "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
        "MAX(CASE WHEN day = 'Monday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ', room.room_section) END) AS Monday",
        "MAX(CASE WHEN day = 'Tuesday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Tuesday",
        "MAX(CASE WHEN day = 'Wednesday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Wednesday",
        "MAX(CASE WHEN day = 'Thursday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Thursday",
        "MAX(CASE WHEN day = 'Friday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Friday",
        "MAX(CASE WHEN day = 'Saturday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Saturday"

      ])
      .leftJoin(RoomsSection, 'room', 'room.id = A.roomId')
      .leftJoin(Subject, 'sub', 'sub.id = A.subjectId')
      .leftJoin(UserDetail, 'ud', 'ud.id = A.teacherID')
      .where('A.teacherID = "'+user.userdetail.id+'"')
      .andWhere('A.school_yearId = "'+filter+'"')
      .groupBy('A.times_slot_from,A.times_slot_to,A.teacherID')
      .orderBy('A.times_slot_from')
      .getRawMany();
    return data;
  }

  async updateEnrolledStudent(updateVS: UpdateEnrollStudentDto) {

    // console.log(updateVS)
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
 
        await queryRunner.manager.update(EnrollStudent , Number(updateVS.id), {
          statusEnrolled: updateVS.statusEnrolled,
          school_yearId:updateVS.schoo_yearId,
          grade_level:updateVS.grade_level,
          seniorJunior:updateVS.seniorJunior,
          fname:updateVS.fname,
          lname:updateVS.lname,
          mname:updateVS.mname,
          suffix:updateVS.suffix,
          email:updateVS.email,
          bdate:updateVS.bdate,
          birth_place:updateVS.birth_place,
          civil_status:updateVS.civil_status,
          sex:updateVS.sex,
          height:updateVS.height,
          weight:updateVS.weight,
          ip_Name:updateVS.ip_Name,
          fourpis:updateVS.fourpis,
          blood_type:updateVS.blood_type,
          isFilipino:updateVS.isFilipino,
          mobile_no:updateVS.mobile_no,
          residential_zip:updateVS.residential_zip,
          residential_house_no:updateVS.residential_house_no,
          residential_street:updateVS.residential_street,
          residential_subd:updateVS.residential_subd,
          residential_brgy:updateVS.residential_brgy,
          residential_city:updateVS.residential_city,
          residential_prov:updateVS.residential_prov,
          permanent_zip:updateVS.permanent_zip,
          permanent_house_no:updateVS.permanent_house_no,
          permanent_street:updateVS.permanent_street,
          permanent_subd:updateVS.permanent_subd,
          permanent_brgy:updateVS.permanent_brgy,
          permanent_city:updateVS.permanent_city,
          permanent_prov:updateVS.permanent_prov,
          father_fname:updateVS.father_fname,
          father_mname:updateVS.father_mname,
          father_lname:updateVS.father_lname,
          father_number:updateVS.father_number,
          mother_fname:updateVS.mother_fname,
          mother_mname:updateVS.mother_mname,
          mother_lname:updateVS.mother_lname,
          mother_number:updateVS.mother_number,
          guardian_fname:updateVS.guardian_fname,
          guardian_mname:updateVS.guardian_mname,
          guardian_lname:updateVS.guardian_lname,
          guardian_number:updateVS.guardian_number,
          last_grade_completed:updateVS.last_grade_completed,
          last_year_completed:updateVS.last_year_completed,
          last_school_attended:updateVS.last_school_attended,
          last_school_ID:updateVS.last_school_ID,
          track:updateVS.track,
          semester:updateVS.semester,
          strand:updateVS.strand,
          picture:updateVS.picture,
          goodMoral:updateVS.goodMoral,
          birthPSA:updateVS.birthPSA,
          schoolCard:updateVS.schoolCard
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

async getClassProgramm(grade: string , section : number, filter:number ) {
 
    const toReturn = await this.dataSource.query(
      '  SELECT  CONCAT(t1.times_slot_from,  " - ", t1.times_slot_to) AS time ,CONCAT(t2.lname,  " ,", t2.fname) AS name ,t1.id as availId,  t1.*, t2.*, t3.*, t4.* FROM availability t1 LEFT JOIN user_detail t2 ON t1.teacherID = t2.id LEFT JOIN rooms_section t3 ON t1.roomId = t3.id LEFT JOIN subject t4 ON t1.subjectId = t4.id where t1.grade_level = "'+ grade +'" and t1.roomId ="'+section+'" and t1.school_yearId ="'+filter+'" order by t1.day ASC, t1.times_slot_from ASC' ,      
    );
    return toReturn;


}



async remove(id: number) {
  let queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.delete(Availability, id);

    await queryRunner.commitTransaction();
    return {
      msg: 'Successfully deleted!',
      status: HttpStatus.OK,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return {
      msg: 'Deleting data failed!',
      status: HttpStatus.BAD_REQUEST,
    };
  } finally {
    await queryRunner.release();
  }
}

async updateClassProgram(id: number,
  updateAvailabilityDto: UpdateAvailabilityDto,
  user: any,) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

  try {
    // Check for conflicts
    // const conflict = await this.checkConflictUpdate(updateAvailabilityDto);

    // if (conflict) {
    //   return {
    //     msg: 'Conflict detected. Schedule cannot be updated.',
    //     status: HttpStatus.CONFLICT,
    //     conflictDetails: conflict,
    //   };
    // }

    // let hours =  await this.dataSource.query('SELECT '+id+', SUM(hours) AS total_hours_per_weekFROM availability GROUP BY '+id+';')
    // if(hours >= 31){
    //   return {
    //     msg: 'Update conflict faculty already reach 30 hours in total of loading!',
    //     status: HttpStatus.CONFLICT,
    //     conflictDetails: hours,
    //   };
    // }

    // update the schedule
    await queryRunner.manager.update(Availability, id, {
      teacherID: updateAvailabilityDto.teacherID,
      subjectId: updateAvailabilityDto.subjectId,
      roomId: updateAvailabilityDto.roomId,
      times_slot_from: updateAvailabilityDto.times_slot_from,
      times_slot_to: updateAvailabilityDto.times_slot_to,
      day: updateAvailabilityDto.day,
      hours: updateAvailabilityDto.hours,
      grade_level: updateAvailabilityDto.grade_level,
      // isActive: updateMyCoreTimeDto.isActive,
    });


  await queryRunner.commitTransaction();
  return {
    msg: 'Schedule updated successfully!',
    status: HttpStatus.OK,
  };
} catch (error) {
  await queryRunner.rollbackTransaction();
  return {
    msg: 'Update failed!' + error,
    status: HttpStatus.BAD_REQUEST,
  };
} finally {
  await queryRunner.release();
}
}


async updateSchoolYear(id: number,
  updateSchoolYearDto: UpdateSchoolYearDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  try {

    await this.dataSource.manager.query(`UPDATE school_year SET status = 0`);
    await queryRunner.manager.update(SchoolYear, id, {
      // school_year_from: updateSchoolYearDto.school_year_from,
      // school_year_to: updateSchoolYearDto.school_year_to,
      status: updateSchoolYearDto.status,
    });


  await queryRunner.commitTransaction();
  return {
    msg: 'School year updated successfully!',
    status: HttpStatus.OK,
  };
} catch (error) {
  await queryRunner.rollbackTransaction();
  return {
    msg: 'Update failed!' + error,
    status: HttpStatus.BAD_REQUEST,
  };
} finally {
  await queryRunner.release();
}
}


async checkConflictUpdate(data: any){
  try {
    const conflicts = await this.availabilityRepository
    .createQueryBuilder('availability')
    .where('availability.day = :day', { day: data.day })
    .andWhere(
      new Brackets((qb) => {

        // Dili mag repeat ang subject in the same room per day
        qb.where('availability.roomId = :roomId AND availability.subjectId = :subjectId', {
          roomId: data.roomId,
          subjectId: data.subjectId,
        });

        // No overlapping of time slots in the same room per day
        qb.orWhere(
          'availability.roomId = :roomId AND :from < availability.times_slot_to AND :to > availability.times_slot_from',
          { roomId: data.roomId, from: data.times_slot_from, to: data.times_slot_to }
        );

        // No duplicate subjects across different faculty or rooms per day
        qb.orWhere('availability.subjectId = :subjectId', { subjectId: data.subjectId });

        // Dapat walay conflicts ang faculty in time slots per room per day
        qb.orWhere(
          'availability.teacherID = :teacherID AND :from < availability.times_slot_to AND :to > availability.times_slot_from',
          { teacherID: data.teacherID, from: data.times_slot_from, to: data.times_slot_to }
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


async enrollStudentWithFile( body:any, filename: any){
    try {
     let data = this.dataSource.manager.create(EnrollStudent,{
      fname: body.fname,
      lname: body.lname,
      mname: body.mname,
      suffix: body.suffix,
      email: body.email,
      bdate: body.bdate,
      birth_place: body.birth_place,
      sex: body.sex,
      civil_status: body.civil_status,
      seniorJunior: body.seniorJunior,
      transfered: body.transfered,
      height: body.height,
      weight: body.weight,
      is_IP: body.is_IP,
      ip_Name: body.ip_Name,
      fourPs: body.fourPs,
      fourpis: body.fourpis,
      disability: body.disability,
      disability_desc: body.disability_desc,
      blood_type: body.blood_type,
      isFilipino: body.isFilipino,
      mobile_no: body.mobile_no,
      residential_zip: body.residential_zip,
      residential_house_no: body.residential_house_no,
      residential_street: body.residential_street,
      residential_subd: body.residential_subd,
      residential_brgy: body.residential_brgy,
      residential_city: body.residential_city,
      residential_prov: body.residential_prov,
      permanent_zip: body.permanent_zip,
      permanent_house_no: body.permanent_house_no,
      permanent_street: body.permanent_street,
      permanent_subd: body.permanent_subd,
      permanent_brgy: body.permanent_brgy,
      permanent_city: body.permanent_city,
      permanent_prov: body.permanent_prov,
      father_fname: body.father_fname,
      father_mname: body.father_mname,
      father_lname: body.father_lname,
      father_number: body.father_number,
      mother_fname: body.mother_fname,
      mother_mname: body.mother_mname,
      mother_lname: body.mother_lname,
      mother_number: body.mother_number,
      guardian_fname: body.guardian_fname,
      guardian_mname: body.guardian_mname,
      guardian_lname: body.guardian_lname,
      guardian_number: body.guardian_number,
      last_grade_completed: body.last_grade_completed,
      last_year_completed: body.last_year_completed,
      last_school_attended: body.last_school_attended,
      last_school_ID: body.last_school_ID,
      track: body.track,
      semester: body.track,
      strand: body.track,
      goodMoral: filename[0].filename,
      schoolCard: filename[1].filename,
      birthPSA: filename[2].filename,
      picture: filename[3].filename,
      school_yearId:body.school_yearId,
      grade_level:body.grade_level
    })
   
    await this.enrollStudentRepository.save(data);
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

async update_student_file( body:any, filename: any){
  // console.log('Files',filename)
   let studentData = await this.dataSource.manager.query("SELECT * FROM enroll_student where id = "+body.id+" ");
  
  //  console.log(studentData[0].picture)
  //  console.log(studentData[0].goodMoral)
  //  console.log(studentData[0].birthPSA)
  //  console.log(studentData[0].schoolCard)
  

  
  //Picture File
    const matchingFilepicture = filename.find(file => file.originalname === body.picture);
  // Extract the filename
    const filenamePicture = matchingFilepicture ? matchingFilepicture.filename : studentData[0].picture;
    let updatePicture = studentData[0].picture != body.picture ? filenamePicture :  studentData[0].picture;

  //School Card File
  const matchingFileschoolCard = filename.find(file => file.originalname === body.schoolCard);
  // Extract the filename
    const filenameSchoolCard = matchingFileschoolCard ? matchingFileschoolCard.filename : studentData[0].schoolCard;
    let updateSchoolCard = studentData[0].schoolCard != body.schoolCard ? filenameSchoolCard :  studentData[0].schoolCard;


      //Birth PSA File
  const matchingFilebirthPSA = filename.find(file => file.originalname === body.birthPSA);
  // Extract the filename
    const filenameBirthPSA = matchingFilebirthPSA ? matchingFilebirthPSA.filename : studentData[0].birthPSA;
    let updateBirthPsa = studentData[0].birthPSA != body.birthPSA ? filenameBirthPSA :  studentData[0].birthPSA;


         //Birth PSA File
  const matchingFilegoodMoral = filename.find(file => file.originalname === body.goodMoral);
  // Extract the filename
    const filenameGoodMoral = matchingFilegoodMoral ? matchingFilegoodMoral.filename : studentData[0].goodMoral;
    let updateGoodMoral = studentData[0].goodMoral != body.goodMoral ? filenameGoodMoral :  studentData[0].goodMoral;

    const data ={
      picture:updatePicture,
      schoolCard:updateSchoolCard,
      birthPSA:updateBirthPsa,
      goodMoral:updateGoodMoral,
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.dataSource.manager.update(EnrollStudent,body.id,data
    )
    await queryRunner.commitTransaction();
    return{
      msg:'Updated successfully!', status:HttpStatus.CREATED
    }
  
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return{
      msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
    }
  } finally {
    await queryRunner.release();
  }
  }


  async getTotalEnrolledStudent(filter:number ,status:number) {
    // console.log('status',status)
    let catchData;
    let catchData1;
    if(status == 1){
      catchData = 'Elementary'
    }else{
      catchData = 'Junior High'
      catchData1 = 'Senior High'
    }

    let enrolled = await this.dataSource.manager
    .createQueryBuilder(EnrollStudent, 'ES')
    .select([
      "COUNT(*) as numberEnrolled",
    ])
    .where('statusEnrolled = 1')
    .andWhere('school_yearId = "'+filter+'"')
    .andWhere('seniorJunior IN (:...values)', {
      values: [catchData, catchData1],
    })
    .getRawMany();


    let verify = await this.dataSource.manager
    .createQueryBuilder(EnrollStudent, 'ES')
    .select([
      "COUNT(*) as numberVerify",
    ])
    .where('statusEnrolled = 0')
    .andWhere('school_yearId = "'+filter+'"')
    .andWhere('seniorJunior IN (:...values)', {
      values: [catchData, catchData1],
    })
    .getRawMany();

    // console.log('Enrolled',enrolled[0].numberEnrolled)
    // console.log('Verify',verify[0].numberVerify)
    let enrolledData = parseInt(enrolled[0].numberEnrolled)
    let verifyData = parseInt(verify[0].numberVerify)
   
  return {enrolledData,verifyData};
  }

}
