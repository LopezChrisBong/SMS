import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnrollStudentDto } from './dto/create-enroll-student.dto';
import { UpdateEnrollStudentDto } from './dto/update-enroll-student.dto';
import { In } from 'typeorm';
import {
  Availability,
  CallbackElementaryEnrollmentSummary,
  CallbackEnrollmentSummary,
  ElementaryEnrollmentSummary,
  EnrollmentSummary,
  EnrollStudent,
  RoomsSection,
  StudentEnrollmentHistory,
  StudentList,
  Subject,
  UserDetail,
  Users,
} from 'src/entities';
import { Brackets, DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { SchoolYear } from './entities/scholl-year.entity';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import e from 'express';
import { GRADE_STRUCTURE } from './grade-structure.helpers';
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
      let applyStudent = this.enrollStudentRepository.create(
        createEnrollStudentDto,
      );
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
      const count = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM school_year where school_year_from ="' +
          createSchoolYearDto.school_year_from +
          '"',
      );
      if (count[0].count == 0) {
        let addYear = this.schooyearRepository.create(createSchoolYearDto);
        await this.schooyearRepository.save(addYear);
        return {
          msg: 'Saved successfully.',
          status: HttpStatus.CREATED,
        };
      }
      return {
        msg: 'School year already exist!',
        status: HttpStatus.BAD_REQUEST,
      };
    } catch (error) {
      return {
        msg: 'Saving failed',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async AddSchedule(createAvailabilityDto: CreateAvailabilityDto) {
    const savedDays: string[] = [];
    const skippedDays: string[] = [];

    try {
      for (const day of createAvailabilityDto.day) {
        const data = {
          teacherID: createAvailabilityDto.teacherID,
          subjectId: createAvailabilityDto.subjectId,
          roomId: createAvailabilityDto.roomId,
          grade_level: createAvailabilityDto.grade_level,
          day,
          times_slot_from: createAvailabilityDto.times_slot_from,
          times_slot_to: createAvailabilityDto.times_slot_to,
          hours: createAvailabilityDto.hours,
          school_yearId: createAvailabilityDto.school_yearId,
        };

        const conflict = await this.newCheckConflict(JSON.stringify(data));

        if (!conflict.conflict) {
          const newSchedule = this.dataSource.manager.create(
            Availability,
            data,
          );
          await this.availabilityRepository.save(newSchedule);
          savedDays.push(day);
        } else {
          skippedDays.push(day);
        }
      }

      if (savedDays.length === 0) {
        return {
          msg: `No schedules were added. All selected days have conflicts: ${skippedDays.join(
            ', ',
          )}`,
          savedDays,
          skippedDays,
          status: HttpStatus.BAD_REQUEST,
        };
      }
      return {
        msg:
          `Schedules added successfully for days: ${savedDays.join(', ')}` +
          (skippedDays.length
            ? `. Skipped due to conflict: ${skippedDays.join(', ')}`
            : ''),
        savedDays,
        skippedDays,
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

  async newCheckConflict(data: string) {
    try {
      const newData = JSON.parse(data);
      console.log(newData);
      const conflicts = await this.availabilityRepository
        .createQueryBuilder('availability')
        .select([
          'availability.*',
          'room.room_section as room_section',
          'sub.subject_title as subject_title',
        ])
        .leftJoin(RoomsSection, 'room', 'room.id = availability.roomId')
        .leftJoin(Subject, 'sub', 'sub.id = availability.subjectId')
        .where('availability.day = :day', { day: newData.day })
        .andWhere(
          new Brackets((qb) => {
            qb.where(
              'availability.roomId = :roomId AND availability.subjectId = :subjectId',
              { roomId: newData.roomId, subjectId: newData.subjectId },
            );

            qb.orWhere(
              `availability.roomId = :roomId 
             AND :from < availability.times_slot_to 
             AND :to > availability.times_slot_from`,
              {
                roomId: newData.roomId,
                from: newData.times_slot_from,
                to: newData.times_slot_to,
              },
            );

            qb.orWhere(
              `availability.teacherID = :teacherID 
             AND :from < availability.times_slot_to 
             AND :to > availability.times_slot_from`,
              {
                teacherID: newData.teacherID,
                from: newData.times_slot_from,
                to: newData.times_slot_to,
              },
            );
          }),
        )
        .andWhere('availability.id != :id', { id: newData.availId || 0 })
        .getRawMany();

      const hasConflict = conflicts.length > 0;

      return {
        status: hasConflict ? 409 : 200,
        message: hasConflict ? 'Schedule conflict detected.' : 'No conflicts.',
        conflictData: conflicts,
        conflict: hasConflict,
      };
    } catch (error) {
      console.error('Error checking conflict:', error);
      throw new Error('Error checking schedule conflict');
    }
  }

  async checkConflict(data: string) {
    try {
      const newData = JSON.parse(data);

      const conflicts = await this.availabilityRepository
        .createQueryBuilder('availability')
        .select([
          'availability.*',
          'room.room_section as room_section',
          'sub.subject_title as subject_title',
        ])
        .leftJoin(RoomsSection, 'room', 'room.id = availability.roomId')
        .leftJoin(Subject, 'sub', 'sub.id = availability.subjectId')
        .where('availability.day = :day', { day: newData.day })
        .andWhere(
          new Brackets((qb) => {
            //  Same subject in the same room on the same day (duplicate subject in same room)
            qb.where(
              'availability.roomId = :roomId AND availability.subjectId = :subjectId',
              { roomId: newData.roomId, subjectId: newData.subjectId },
            );

            // Overlapping time slots in the same room on same day
            qb.orWhere(
              `availability.roomId = :roomId 
             AND :from < availability.times_slot_to 
             AND :to > availability.times_slot_from`,
              {
                roomId: newData.roomId,
                from: newData.times_slot_from,
                to: newData.times_slot_to,
              },
            );

            //  Same subject used by another teacher or room on same day
            // qb.orWhere('availability.subjectId = :subjectId', {
            //   subjectId: newData.subjectId,
            // });

            //  Faculty schedule conflict (same teacher, overlapping times)
            qb.orWhere(
              `availability.teacherID = :teacherID 
             AND :from < availability.times_slot_to 
             AND :to > availability.times_slot_from`,
              {
                teacherID: newData.teacherID,
                from: newData.times_slot_from,
                to: newData.times_slot_to,
              },
            );
          }),
        )
        // ignore self when updating
        .andWhere('availability.id != :id', { id: newData.availId || 0 })
        .getRawMany();

      if (conflicts.length > 0) {
        // console.log(' Conflict found:', conflicts);
        return {
          status: 409,
          message: 'Schedule conflict detected.',
          conflictData: conflicts,
          conflict: conflicts.length > 0,
        };
      }

      // console.log(' No conflict detected.');
      return {
        status: 200,
        message: 'No conflicts.',
        conflict: conflicts.length > 0,
      };
    } catch (error) {
      // console.error(' Error checking conflict:', error);
      throw new Error('Error checking schedule conflict');
    }
  }

  async EnrollStudent(curr_user: any) {
    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="' + curr_user.userdetail.id + '"',
    );

    let school_level;
    let school_level1;
    if (user[0].status == 1) {
      school_level = 'Elementary';
      school_level1 = 'Primary';
    } else {
      school_level = 'Junior High';
      school_level1 = 'Senior High';
    }

    let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select([
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.lname, ' ',SUBSTRING(ES.mname, 1, 1) ,' ',ES.fname) ,concat(ES.lname, ' ', ES.fname)) as name",
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
      .andWhere('ES.isSubmitted = 1')
      .getRawMany();

    return data;
  }

  async EnrolledStudent(curr_user: any) {
    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="' + curr_user.userdetail.id + '"',
    );

    let school_level;
    let school_level1;
    if (user[0].status == 1) {
      school_level = 'Elementary';
      school_level1 = 'Primary';
    } else {
      school_level = 'Junior High';
      school_level1 = 'Senior High';
    }
    let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select([
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.lname, ' ',SUBSTRING(ES.lname, 1, 1) ,' ',ES.fname) ,concat(ES.lname, ' ', ES.fname)) as name",
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
        'ES.LRN as LRN',
      ])
      .andWhere('ES.statusEnrolled = 1')
      .andWhere('ES.seniorJunior IN (:...values)', {
        values: [school_level, school_level1],
      })
      .getRawMany();
    return data;
  }

  async AddClassStudent(grade: string) {
    let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select([
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.lname, ' ',SUBSTRING(ES.mname, 1, 1) ,' ',ES.fname) ,concat(ES.fname, ' ', ES.lname)) as name",
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
      .andWhere('ES.grade_level = "' + grade + '"')
      .orderBy('')
      .getRawMany();
    return data;
  }

  async FacultySchedule(filter: number, curr_user: any) {
    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="' + curr_user.userdetail.id + '"',
    );
    let data = await this.dataSource.manager
      .createQueryBuilder(Availability, 'A')
      .select([
        'A.id as id',
        "CONCAT(times_slot_from, ' - ', times_slot_to) AS time",
        "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,' ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
        "MAX(CASE WHEN day = 'Monday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ', room.room_section) END) AS Monday",
        "MAX(CASE WHEN day = 'Tuesday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Tuesday",
        "MAX(CASE WHEN day = 'Wednesday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Wednesday",
        "MAX(CASE WHEN day = 'Thursday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Thursday",
        "MAX(CASE WHEN day = 'Friday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Friday",
        "MAX(CASE WHEN day = 'Saturday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Saturday",
      ])
      .leftJoin(RoomsSection, 'room', 'room.id = A.roomId')
      .leftJoin(Subject, 'sub', 'sub.id = A.subjectId')
      .leftJoin(UserDetail, 'ud', 'ud.id = A.teacherID')
      .where('A.school_yearId = "' + filter + '"')
      .andWhere('ud.status = "' + user[0].status + '"')
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
        '*',
        "CONCAT(school_year_from, ' - ', school_year_to) AS school_year",
        "CONCAT(school_year_from, '-06-01') as startDate,CONCAT(school_year_to, '-05-31') as endDate",
      ])
      .getRawMany();

    return data;
  }

  async getSchoolYearGenerate(grade: string, filter: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select(['COUNT(*) as conflict'])
      .where('grade_level = "' + grade + '"')
      .andWhere('school_yearId = "' + filter + '"')
      .getRawMany();
    return data;
  }

  async MySchedule(user: any, filter: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(Availability, 'A')
      .select([
        'A.id as id',
        "CONCAT(times_slot_from, ' - ', times_slot_to) AS time",
        "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,' ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
        "MAX(CASE WHEN day = 'Monday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ', room.room_section) END) AS Monday",
        "MAX(CASE WHEN day = 'Tuesday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Tuesday",
        "MAX(CASE WHEN day = 'Wednesday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Wednesday",
        "MAX(CASE WHEN day = 'Thursday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Thursday",
        "MAX(CASE WHEN day = 'Friday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Friday",
        "MAX(CASE WHEN day = 'Saturday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Saturday",
      ])
      .leftJoin(RoomsSection, 'room', 'room.id = A.roomId')
      .leftJoin(Subject, 'sub', 'sub.id = A.subjectId')
      .leftJoin(UserDetail, 'ud', 'ud.id = A.teacherID')
      .where('A.teacherID = :teacherId', { teacherId: user.userdetail.id })
      .andWhere('A.school_yearId = :filter', { filter })
      .groupBy('A.times_slot_from,A.times_slot_to,A.teacherID')
      .orderBy(
        `
        CASE 
          WHEN STR_TO_DATE(A.times_slot_from, '%H:%i') < STR_TO_DATE('07:00', '%H:%i')
          THEN STR_TO_DATE(A.times_slot_from, '%H:%i') + INTERVAL 24 HOUR
          ELSE STR_TO_DATE(A.times_slot_from, '%H:%i')
        END
      `,
      )
      .getRawMany();

    return data;
  }

  async getStudentSchedule(studentID: number) {
    let filter = await this.dataSource.manager.findOneBy(SchoolYear, {
      status: true,
    });
    let studentLister = await this.dataSource.manager.findOneBy(StudentList, {
      school_yearId: filter.id,
      studentId: studentID,
    });
    if (!studentLister) {
      return null;
    }
    let selectRoom = await this.dataSource.manager.findOneBy(RoomsSection, {
      id: studentLister.roomId,
    });

    let adviser = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'ud')
      .select([
        "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,' ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
      ])
      .where('ud.id = :id', { id: selectRoom.teacherId })
      .getRawOne();

    let data = await this.dataSource.manager
      .createQueryBuilder(Availability, 'A')
      .select([
        'A.id as id',
        "CONCAT(times_slot_from, ' - ', times_slot_to) AS time",
        "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,' ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
        "MAX(CASE WHEN day = 'Monday' THEN CONCAT('', sub.subject_title) END) AS Monday",
        "MAX(CASE WHEN day = 'Tuesday' THEN CONCAT('', sub.subject_title) END) AS Tuesday",
        "MAX(CASE WHEN day = 'Wednesday' THEN CONCAT('', sub.subject_title) END) AS Wednesday",
        "MAX(CASE WHEN day = 'Thursday' THEN CONCAT('', sub.subject_title) END) AS Thursday",
        "MAX(CASE WHEN day = 'Friday' THEN CONCAT('', sub.subject_title) END) AS Friday",
        "MAX(CASE WHEN day = 'Saturday' THEN CONCAT('', sub.subject_title) END) AS Saturday",
      ])
      .leftJoin(RoomsSection, 'room', 'room.id = A.roomId')
      .leftJoin(Subject, 'sub', 'sub.id = A.subjectId')
      .leftJoin(UserDetail, 'ud', 'ud.id = A.teacherID')
      // .where('A.teacherID = :teacherId', { teacherId: selectRoom.teacherId })
      .where('room.id = :roomID', { roomID: studentLister.roomId })
      .andWhere('A.school_yearId = :filter', { filter: filter.id })
      .groupBy('A.times_slot_from,A.times_slot_to,A.teacherID')
      .orderBy(
        `
        CASE
          WHEN STR_TO_DATE(A.times_slot_from, '%H:%i') < STR_TO_DATE('07:00', '%H:%i')
          THEN STR_TO_DATE(A.times_slot_from, '%H:%i') + INTERVAL 24 HOUR
          ELSE STR_TO_DATE(A.times_slot_from, '%H:%i')
        END
      `,
      )
      .getRawMany();
    // console.log(adviser);
    return { data: data, roomData: selectRoom, adviser: adviser };
  }

  async updateEnrolledStudent(updateVS: UpdateEnrollStudentDto) {
    // console.log(updateVS)

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(EnrollStudent, Number(updateVS.id), {
        statusEnrolled: updateVS.statusEnrolled,
        school_yearId: updateVS.schoo_yearId,
        grade_level: updateVS.grade_level,
        seniorJunior: updateVS.seniorJunior,
        fname: updateVS.fname,
        lname: updateVS.lname,
        mname: updateVS.mname,
        suffix: updateVS.suffix,
        email: updateVS.email,
        bdate: updateVS.bdate,
        birth_place: updateVS.birth_place,
        civil_status: updateVS.civil_status,
        sex: updateVS.sex,
        height: updateVS.height,
        weight: updateVS.weight,
        ip_Name: updateVS.ip_Name,
        fourpis: updateVS.fourpis,
        blood_type: updateVS.blood_type,
        isFilipino: updateVS.isFilipino,
        mobile_no: updateVS.mobile_no,
        residential_zip: updateVS.residential_zip,
        residential_house_no: updateVS.residential_house_no,
        residential_street: updateVS.residential_street,
        residential_subd: updateVS.residential_subd,
        residential_brgy: updateVS.residential_brgy,
        residential_city: updateVS.residential_city,
        residential_prov: updateVS.residential_prov,
        permanent_zip: updateVS.permanent_zip,
        permanent_house_no: updateVS.permanent_house_no,
        permanent_street: updateVS.permanent_street,
        permanent_subd: updateVS.permanent_subd,
        permanent_brgy: updateVS.permanent_brgy,
        permanent_city: updateVS.permanent_city,
        permanent_prov: updateVS.permanent_prov,
        father_fname: updateVS.father_fname,
        father_mname: updateVS.father_mname,
        father_lname: updateVS.father_lname,
        father_number: updateVS.father_number,
        mother_fname: updateVS.mother_fname,
        mother_mname: updateVS.mother_mname,
        mother_lname: updateVS.mother_lname,
        mother_number: updateVS.mother_number,
        guardian_fname: updateVS.guardian_fname,
        guardian_mname: updateVS.guardian_mname,
        guardian_lname: updateVS.guardian_lname,
        guardian_number: updateVS.guardian_number,
        last_grade_completed: updateVS.last_grade_completed,
        last_year_completed: updateVS.last_year_completed,
        last_school_attended: updateVS.last_school_attended,
        last_school_ID: updateVS.last_school_ID,
        track: updateVS.track,
        semester: updateVS.semester,
        strand: updateVS.strand,
        picture: updateVS.picture,
        goodMoral: updateVS.goodMoral,
        birthPSA: updateVS.birthPSA,
        schoolCard: updateVS.schoolCard,
        LRN: updateVS.LRN,
      });
      await queryRunner.commitTransaction();
      return {
        msg:
          updateVS.update_type == 1 ? 'Student Enrolled.' : 'Student Updated.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: error,
        status: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async getClassProgramm(grade: string, section: number, filter: number) {
    const query = `
        SELECT  
          CONCAT(t1.times_slot_from, ' - ', t1.times_slot_to) AS time,
          CONCAT(t2.lname, ', ', t2.fname) AS name,
          t1.id AS availId,
          t1.*, t2.*, t3.*, t4.*
        FROM availability t1
        LEFT JOIN user_detail t2 ON t1.teacherID = t2.id
        LEFT JOIN rooms_section t3 ON t1.roomId = t3.id
        LEFT JOIN subject t4 ON t1.subjectId = t4.id
        WHERE t1.grade_level = ? 
          AND t1.roomId = ?
          AND t1.school_yearId = ?
          AND t1.day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')
        ORDER BY FIELD(t1.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
                STR_TO_DATE(
                  CASE 
                    WHEN CAST(SUBSTRING_INDEX(t1.times_slot_from, ':', 1) AS UNSIGNED) BETWEEN 1 AND 6 
                    THEN CONCAT(CAST(SUBSTRING_INDEX(t1.times_slot_from, ':', 1) AS UNSIGNED) + 12, ':', SUBSTRING_INDEX(t1.times_slot_from, ':', -1))
                    ELSE t1.times_slot_from
                  END,
                  '%H:%i'
                )
      `;

    const params = [grade, section, filter];
    const toReturn = await this.dataSource.query(query, params);
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

  async updateClassProgram(
    id: number,
    updateAvailabilityDto: UpdateAvailabilityDto,
    user: any,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const conflict = await this.checkConflictUpdate(
        updateAvailabilityDto,
        id,
      );

      if (conflict && conflict.length > 0) {
        return {
          msg: 'Conflict detected. Schedule cannot be updated.',
          status: HttpStatus.CONFLICT,
          conflictDetails: conflict,
        };
      }
      await queryRunner.manager.update(Availability, id, {
        teacherID: updateAvailabilityDto.teacherID,
        subjectId: updateAvailabilityDto.subjectId,
        roomId: updateAvailabilityDto.roomId,
        times_slot_from: updateAvailabilityDto.times_slot_from,
        times_slot_to: updateAvailabilityDto.times_slot_to,
        day: updateAvailabilityDto.day,
        hours: updateAvailabilityDto.hours,
        grade_level: updateAvailabilityDto.grade_level,
      });

      await queryRunner.commitTransaction();
      return {
        msg: 'Schedule updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error updating schedule:', error);
      return {
        msg: 'Update failed! ' + error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async updateSchoolYear(id: number, updateSchoolYearDto: UpdateSchoolYearDto) {
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

  async checkConflictUpdate(data: any, currentId?: number) {
    try {
      const conflicts = await this.availabilityRepository
        .createQueryBuilder('availability')
        .where('availability.day = :day', { day: data.day })
        .andWhere(currentId ? 'availability.id != :id' : '1=1', {
          id: currentId,
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where(
              'availability.roomId = :roomId AND availability.subjectId = :subjectId',
              {
                roomId: data.roomId,
                subjectId: data.subjectId,
              },
            );

            qb.orWhere(
              'availability.roomId = :roomId AND :from < availability.times_slot_to AND :to > availability.times_slot_from',
              {
                roomId: data.roomId,
                from: data.times_slot_from,
                to: data.times_slot_to,
              },
            );

            qb.orWhere(
              'availability.subjectId = :subjectId AND :from < availability.times_slot_to AND :to > availability.times_slot_from',
              {
                subjectId: data.subjectId,
                from: data.times_slot_from,
                to: data.times_slot_to,
              },
            );

            qb.orWhere(
              'availability.teacherID = :teacherID AND :from < availability.times_slot_to AND :to > availability.times_slot_from',
              {
                teacherID: data.teacherID,
                from: data.times_slot_from,
                to: data.times_slot_to,
              },
            );
          }),
        )
        .getMany();

      return conflicts.length > 0 ? conflicts : null;
    } catch (error) {
      console.error('Error checking conflict:', error);
      throw error;
    }
  }
  generateCode() {
    let length = 11;
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }

  async enrollStudentWithFile(body: any, filename: any) {
    try {
      let code;
      let conflictCode;

      do {
        code = this.generateCode();
        conflictCode = await this.dataSource.manager.findOneBy(EnrollStudent, {
          CODE: code,
        });
      } while (conflictCode);

      let conflictSave = await this.dataSource
        .getRepository(EnrollStudent)
        .createQueryBuilder('e')
        .where('LOWER(e.fname) = LOWER(:fname)', { fname: body.fname })
        .andWhere('LOWER(e.lname) = LOWER(:lname)', { lname: body.lname })
        .andWhere('e.bdate = :bdate', { bdate: body.bdate })
        .andWhere('e.LRN = :lrn', { lrn: body.LRN })
        .getOne();
      console.log(body.fname, body.lname, body.bdate, body.LRN);
      if (conflictSave) {
        return {
          msg: "Student already submitted it's enrollment!",
          status: HttpStatus.BAD_REQUEST,
        };
      }
      let data = this.dataSource.manager.create(EnrollStudent, {
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
        school_yearId: body.school_yearId.id,
        grade_level: body.grade_level,
        LRN: body.LRN,
        CODE: code,
        isSubmitted: body.confirmAction == 'Save' ? false : true,
      });

      let savedData = await this.enrollStudentRepository.save(data);

      return {
        msg: 'Saved successfully.',
        status: HttpStatus.CREATED,
        savedData: savedData,
      };
    } catch (error) {
      return {
        msg: 'Saving failed',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async updateStudentWithFile(id: number, body: any, files?: any[]) {
    // console.log(id, body, files);
    try {
      const student = await this.dataSource.manager.findOneBy(EnrollStudent, {
        id: id,
      });

      if (!student) {
        return {
          msg: 'Student not found.',
          status: HttpStatus.NOT_FOUND,
        };
      }

      Object.assign(student, {
        ...body,
        transfered: body.transfered == 1 || body.transfered === 'Yes' ? 1 : 0,
        is_IP: body.is_IP == 1 || body.is_IP === 'Yes' ? 1 : 0,
        fourPs: body.fourPs == 1 || body.fourPs === 'Yes' ? 1 : 0,
        disability: body.disability == 1 || body.disability === 'Yes' ? 1 : 0,

        goodMoral: files?.[0]?.filename ?? student.goodMoral,
        schoolCard: files?.[1]?.filename ?? student.schoolCard,
        birthPSA: files?.[2]?.filename ?? student.birthPSA,
        picture: files?.[3]?.filename ?? student.picture,
        isSubmitted: true,
      });

      await this.dataSource.manager.save(student);

      return {
        msg: 'Student updated successfully.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Update Error:', error);

      return {
        msg: 'Update failed.',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async update_student_file(body: any, filename: any) {
    // console.log('Files',filename)
    let studentData = await this.dataSource.manager.query(
      'SELECT * FROM enroll_student where id = ' + body.id + ' ',
    );

    //  console.log(studentData[0].picture)
    //  console.log(studentData[0].goodMoral)
    //  console.log(studentData[0].birthPSA)
    //  console.log(studentData[0].schoolCard)

    //Picture File
    const matchingFilepicture = filename.find(
      (file) => file.originalname === body.picture,
    );
    // Extract the filename
    const filenamePicture = matchingFilepicture
      ? matchingFilepicture.filename
      : studentData[0].picture;
    let updatePicture =
      studentData[0].picture != body.picture
        ? filenamePicture
        : studentData[0].picture;

    //School Card File
    const matchingFileschoolCard = filename.find(
      (file) => file.originalname === body.schoolCard,
    );
    // Extract the filename
    const filenameSchoolCard = matchingFileschoolCard
      ? matchingFileschoolCard.filename
      : studentData[0].schoolCard;
    let updateSchoolCard =
      studentData[0].schoolCard != body.schoolCard
        ? filenameSchoolCard
        : studentData[0].schoolCard;

    //Birth PSA File
    const matchingFilebirthPSA = filename.find(
      (file) => file.originalname === body.birthPSA,
    );
    // Extract the filename
    const filenameBirthPSA = matchingFilebirthPSA
      ? matchingFilebirthPSA.filename
      : studentData[0].birthPSA;
    let updateBirthPsa =
      studentData[0].birthPSA != body.birthPSA
        ? filenameBirthPSA
        : studentData[0].birthPSA;

    //Birth PSA File
    const matchingFilegoodMoral = filename.find(
      (file) => file.originalname === body.goodMoral,
    );
    // Extract the filename
    const filenameGoodMoral = matchingFilegoodMoral
      ? matchingFilegoodMoral.filename
      : studentData[0].goodMoral;
    let updateGoodMoral =
      studentData[0].goodMoral != body.goodMoral
        ? filenameGoodMoral
        : studentData[0].goodMoral;

    const data = {
      picture: updatePicture,
      schoolCard: updateSchoolCard,
      birthPSA: updateBirthPsa,
      goodMoral: updateGoodMoral,
    };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.dataSource.manager.update(EnrollStudent, body.id, data);
      await queryRunner.commitTransaction();
      return {
        msg: 'Updated successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Something went wrong!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async getTotalEnrolledStudent(
    filter: number,
    status: number,
    gradeLevel: string,
  ) {
    console.log('gradeLevel', gradeLevel);
    let catchData;
    let catchData1;
    if (status == 1) {
      catchData = 'Elementary';
    } else {
      catchData = 'Junior High';
      catchData1 = 'Senior High';
    }

    let enrolled1 = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select(['COUNT(*) as numberEnrolled'])
      .leftJoin(StudentEnrollmentHistory, 'SEH', 'SEH.student_id = ES.id')
      .where('ES.statusEnrolled = 1')
      .andWhere('ES.school_yearId = "' + filter + '"')
      .andWhere('SEH.school_yearId = "' + filter + '"')
      .andWhere('ES.isSubmitted = 1')
      .andWhere('ES.seniorJunior IN (:...values)', {
        values: [catchData, catchData1],
      });
    if (gradeLevel !== 'All' || gradeLevel == null) {
      enrolled1.andWhere('ES.grade_level = :gradeLevel', { gradeLevel });
    }
    let enrolled = await enrolled1.getRawMany();

    let enrolledStudents1 = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .leftJoin(StudentEnrollmentHistory, 'SEH', 'SEH.student_id = ES.id')
      .where('ES.statusEnrolled = 1')
      .andWhere('ES.school_yearId = "' + filter + '"')
      .andWhere('SEH.school_yearId = "' + filter + '"')
      .andWhere('ES.isSubmitted = 1')
      .andWhere('ES.seniorJunior IN (:...values)', {
        values: [catchData, catchData1],
      });
    if (gradeLevel !== 'All' || gradeLevel == null) {
      enrolledStudents1.andWhere('ES.grade_level = :gradeLevel', {
        gradeLevel,
      });
    }
    let enrolledStudents = await enrolledStudents1.getRawMany();

    let verify = await this.dataSource.manager
      .createQueryBuilder(EnrollStudent, 'ES')
      .select(['COUNT(*) as numberVerify'])
      .leftJoin(StudentEnrollmentHistory, 'SEH', 'SEH.student_id = ES.id')
      .where('ES.statusEnrolled = 0')
      .andWhere('ES.school_yearId = "' + filter + '"')
      .andWhere('SEH.school_yearId = "' + filter + '"')
      .andWhere('ES.isSubmitted = 1')
      .andWhere('ES.seniorJunior IN (:...values)', {
        values: [catchData, catchData1],
      })
      .getRawMany();

    let teacherData = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'ud')
      .leftJoin(Users, 'us', 'us.id = ud.userID')
      .where('us.isAdminApproved = 1');

    if (status == 1) {
      teacherData.andWhere('ud.status = 1');
    } else {
      teacherData.andWhere('ud.status = 2');
    }

    let teacherDataCount = await teacherData.getRawMany();
    let countTeacher = teacherDataCount.length;
    let teacherf = 0;
    let teacherm = 0;
    for (let i = 0; i < teacherDataCount.length; i++) {
      if (teacherDataCount[i].ud_sex == 'Female') {
        teacherf += 1;
      } else {
        teacherm += 1;
      }
    }

    let roomCount = await this.dataSource.manager.createQueryBuilder(
      RoomsSection,
      'rs',
    );
    if (status == 1) {
      roomCount.where('rs.grade_level IN (:...values)', {
        values: [
          'Kinder 1',
          'Kinder 2',
          'Grade 1',
          'Grade 2',
          'Grade 3',
          'Grade 4',
          'Grade 5',
          'Grade 6',
        ],
      });
    } else {
      roomCount.where('rs.grade_level IN (:...values)', {
        values: [
          'Grade 7',
          'Grade 8',
          'Grade 9',
          'Grade 10',
          'Grade 11',
          'Grade 12',
        ],
      });
    }
    let countRoom = await roomCount.getCount();
    // console.log('countRoom', countRoom);

    let fmcount = 0;
    let mcount = 0;
    for (let i = 0; i < enrolledStudents.length; i++) {
      // console.log(enrolledStudents[i].ES_sex);
      if (enrolledStudents[i].ES_sex == 'Female') {
        fmcount += 1;
      } else {
        mcount += 1;
      }
    }

    let enrolledData = parseInt(enrolled[0].numberEnrolled);
    let verifyData = parseInt(verify[0].numberVerify);

    return {
      enrolledData,
      verifyData,
      fmcount,
      mcount,
      countTeacher,
      teacherf,
      teacherm,
      countRoom,
    };
  }

  async getStudentDataByCode(filter: number, code: string, level: string) {
    let grade_level: string[];

    if (level === 'High School') {
      grade_level = [
        'Grade 7',
        'Grade 8',
        'Grade 9',
        'Grade 10',
        'Grade 11',
        'Grade 12',
      ];
    } else {
      grade_level = [
        'Grade 1',
        'Grade 2',
        'Grade 3',
        'Grade 4',
        'Grade 5',
        'Grade 6',
        'Kinder 1',
        'Kinder 2',
      ];
    }

    const enrolled = await this.dataSource.manager.findOne(EnrollStudent, {
      where: {
        school_yearId: filter,
        CODE: code,
        grade_level: In(grade_level),
      },
    });
    console.log(enrolled);
    return enrolled;
  }

  async studentPortalLogin(
    // firstName: string,
    // lastName: string,
    birthDate: string,
    LRN: string,
    // Code: string,
  ) {
    let credentials = await this.dataSource
      .getRepository(EnrollStudent)
      .createQueryBuilder('e')
      // .where('LOWER(e.fname) = LOWER(:fname)', { fname: firstName })
      // .andWhere('LOWER(e.lname) = LOWER(:lname)', { lname: lastName })
      .andWhere('e.bdate = :bdate', { bdate: birthDate })
      .andWhere('e.LRN = :lrn', { lrn: LRN })
      // .andWhere('e.CODE = :code', { code: Code })
      .getOne();

    // console.log(credentials);
    if (credentials) {
      if (credentials.statusEnrolled == true) {
        console.log('login');
        return {
          msg: 'Login successfully!',
          status: HttpStatus.OK,
          data: credentials,
        };
      } else if (credentials.statusEnrolled == false) {
        console.log('not enrolled');
        return {
          msg: 'Student not enrolled!',
          status: HttpStatus.BAD_REQUEST,
        };
      }
    } else {
      console.log('not student');
      return {
        msg: 'Student not existed!',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async generateSummary() {
    // 1️ Get active school year
    const activeSY = await this.dataSource
      .createQueryBuilder()
      .select('sy.id', 'id')
      .from('school_year', 'sy')
      .where('sy.status = :status', { status: 1 })
      .getRawOne();

    if (!activeSY) {
      console.log('No active school year found.');
      throw new Error('No active school year found.');
    }

    const schoolYearId = activeSY.id;

    // Delete old summary
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(EnrollmentSummary)
      .where('school_year_id = :id', { id: schoolYearId })
      .execute();

    // JUNIOR HIGH (Grade 7–10)
    const juniorData = await this.dataSource
      .createQueryBuilder()
      .select('e.grade_level', 'grade_level')
      .addSelect(
        `SUM(CASE WHEN e.sex = 'Male' THEN 1 ELSE 0 END)`,
        'male_count',
      )
      .addSelect(
        `SUM(CASE WHEN e.sex = 'Female' THEN 1 ELSE 0 END)`,
        'female_count',
      )
      .addSelect('COUNT(*)', 'total_count')
      .from('enroll_student', 'e')
      .where('e.school_yearId = :sy', { sy: schoolYearId })
      .andWhere(`e.grade_level IN ('Grade 7','Grade 8','Grade 9','Grade 10')`)
      .andWhere('e.statusEnrolled = 1')
      .groupBy('e.grade_level')
      .getRawMany();

    // Save junior high
    for (const row of juniorData) {
      await this.dataSource.getRepository(EnrollmentSummary).save({
        school_year_id: schoolYearId,
        grade_level: row.grade_level,
        track: null,
        male_count: Number(row.male_count),
        female_count: Number(row.female_count),
        total_count: Number(row.total_count),
      });
    }

    // SENIOR HIGH (Grade 11–12 by Track)
    const seniorData = await this.dataSource
      .createQueryBuilder()
      .select('e.grade_level', 'grade_level')
      .addSelect('e.track', 'track')
      .addSelect(
        `SUM(CASE WHEN e.sex = 'Male' THEN 1 ELSE 0 END)`,
        'male_count',
      )
      .addSelect(
        `SUM(CASE WHEN e.sex = 'Female' THEN 1 ELSE 0 END)`,
        'female_count',
      )
      .addSelect('COUNT(*)', 'total_count')
      .from('enroll_student', 'e')
      .where('e.school_yearId = :sy', { sy: schoolYearId })
      .andWhere(`e.grade_level IN ('Grade 11','Grade 12')`)
      .andWhere('e.statusEnrolled = 1')
      .groupBy('e.grade_level')
      .addGroupBy('e.track')
      .getRawMany();

    // Save senior high
    for (const row of seniorData) {
      await this.dataSource.getRepository(EnrollmentSummary).save({
        school_year_id: schoolYearId,
        grade_level: row.grade_level,
        track: row.track,
        male_count: Number(row.male_count),
        female_count: Number(row.female_count),
        total_count: Number(row.total_count),
      });
    }
    console.log({ message: 'Enrollment summary generated successfully.' });
    return { message: 'Enrollment summary generated successfully.' };
  }
  async generateSummaryElementary() {
    //  Get active school year
    const activeSY = await this.dataSource
      .createQueryBuilder()
      .select('sy.id', 'id')
      .from('school_year', 'sy')
      .where('sy.status = :status', { status: 1 })
      .getRawOne();

    if (!activeSY) {
      console.log('No active school year found.');
      throw new Error('No active school year found.');
    }

    const schoolYearId = activeSY.id;

    // Delete old data for this SY
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ElementaryEnrollmentSummary)
      .where('school_year_id = :id', { id: schoolYearId })
      .execute();

    // Query Elementary (Kinder 1–2, Grade 1–6)
    const data = await this.dataSource
      .createQueryBuilder()
      .select('e.grade_level', 'grade_level')
      .addSelect(
        `SUM(CASE WHEN e.sex = 'Male' THEN 1 ELSE 0 END)`,
        'male_count',
      )
      .addSelect(
        `SUM(CASE WHEN e.sex = 'Female' THEN 1 ELSE 0 END)`,
        'female_count',
      )
      .addSelect('COUNT(*)', 'total_count')
      .from('enroll_student', 'e')
      .where('e.school_yearId = :sy', { sy: schoolYearId })
      .andWhere('e.statusEnrolled = 1')
      .andWhere(
        `
        e.grade_level IN (
          'Kinder 1',
          'Kinder 2',
          'Grade 1','Grade 2','Grade 3',
          'Grade 4','Grade 5','Grade 6'
        )
      `,
      )
      .groupBy('e.grade_level')
      .getRawMany();

    //  Save results
    for (const row of data) {
      await this.dataSource.getRepository(ElementaryEnrollmentSummary).save({
        school_year_id: schoolYearId,
        grade_level: row.grade_level,
        male_count: Number(row.male_count),
        female_count: Number(row.female_count),
        total_count: Number(row.total_count),
      });
    }
    console.log({ message: 'Elementary summary generated successfully.' });
    return { message: 'Elementary summary generated successfully.' };
  }
  async getDataForForcastingHighSchool() {
    let oldHighSchool = await this.dataSource.manager
      .createQueryBuilder(CallbackEnrollmentSummary, 'CE')
      .select([
        'CE.id as id',
        'CE.school_year_from as school_year_from',
        'CE.school_year_to as school_year_to',
        'CE.grade_level as grade_level',
        'CE.track as track',
        'CE.male_count as male_count',
        'CE.female_count as female_count',
        'CE.total_count as total_count',
      ])
      .getRawMany();
    // console.log('oldHighSchool', oldHighSchool);
    let summaryData = await this.dataSource.manager
      .createQueryBuilder(EnrollmentSummary, 'ES')
      .select([
        'ES.id as id',
        'ES.grade_level as grade_level',
        'ES.male_count as male_count',
        'ES.female_count as female_count',
        'ES.total_count as total_count',
        'SY.school_year_from as school_year_from',
        'SY.school_year_to as school_year_to',
        'ES.track as track',
      ])
      .leftJoin(SchoolYear, 'SY', 'SY.id = ES.school_year_id')
      .getRawMany();
    // console.log('summaryData', summaryData);
    // let newArr = [...oldHighSchool, ...summaryData];
    let newArr = [...oldHighSchool];
    // console.log(newArr);
    let year = 5;
    const forecasted = await this.generateCohortForecast(newArr, Number(year));
    // console.log(forecasted);
    return forecasted.forecast;
  }

  async getDataForForcastingElementary() {
    let oldElementary = await this.dataSource.manager
      .createQueryBuilder(CallbackElementaryEnrollmentSummary, 'CE')
      .select([
        'CE.id as id',
        'CE.school_year_from as school_year_from',
        'CE.school_year_to as school_year_to',
        'CE.grade_level as grade_level',
        // 'CE.track as track',
        'CE.male_count as male_count',
        'CE.female_count as female_count',
        'CE.total_count as total_count',
      ])
      .getRawMany();
    // console.log('oldHighSchool', oldHighSchool);
    let summaryData = await this.dataSource.manager
      .createQueryBuilder(EnrollmentSummary, 'ES')
      .select([
        'ES.id as id',
        'ES.grade_level as grade_level',
        'ES.male_count as male_count',
        'ES.female_count as female_count',
        'ES.total_count as total_count',
        'SY.school_year_from as school_year_from',
        'SY.school_year_to as school_year_to',
        'ES.track as track',
      ])
      .leftJoin(SchoolYear, 'SY', 'SY.id = ES.school_year_id')
      .getRawMany();
    // console.log('summaryData', summaryData);
    // let newArr = [...oldHighSchool, ...summaryData];
    let newArr = [...oldElementary];
    // console.log('Elementary', newArr);
    let year = 5;
    const forecasted = await this.generateCohortForecastElementary(
      newArr,
      Number(year),
    );
    // console.log(forecasted);
    return forecasted.forecast;
  }

  // private readonly STUDENTS_PER_TEACHER = 40;
  // async generateCohortForecast(enrollments: any[], years) {
  //   // Group by school year & grade level
  //   const grouped: Record<string, any> = {};

  //   enrollments.forEach((record) => {
  //     const yearKey = `${record.school_year_from}-${record.school_year_to}`;
  //     const grade = record.grade_level;

  //     if (!grouped[yearKey]) grouped[yearKey] = {};
  //     if (!grouped[yearKey][grade]) grouped[yearKey][grade] = 0;

  //     grouped[yearKey][grade] += record.total_count;
  //   });

  //   const yearsList = Object.keys(grouped).sort();
  //   const latestYear = yearsList[yearsList.length - 1];

  //   const baselineGrades = { ...grouped[latestYear] };

  //   //  Estimate Grade 7 intake average (last 3 years)
  //   const last3Years = yearsList.slice(-3);
  //   const grade7Average =
  //     last3Years.reduce((sum, yr) => {
  //       return sum + (grouped[yr]['Grade 7'] || 0);
  //     }, 0) / last3Years.length;

  //   let currentGrades = { ...baselineGrades };
  //   const forecast = [];

  //   for (let i = 1; i <= years; i++) {
  //     const nextGrades: Record<string, number> = {};

  //     nextGrades['Grade 12'] = currentGrades['Grade 11'] || 0;
  //     nextGrades['Grade 11'] = currentGrades['Grade 10'] || 0;
  //     nextGrades['Grade 10'] = currentGrades['Grade 9'] || 0;
  //     nextGrades['Grade 9'] = currentGrades['Grade 8'] || 0;
  //     nextGrades['Grade 8'] = currentGrades['Grade 7'] || 0;
  //     nextGrades['Grade 7'] = Math.round(grade7Average);

  //     const totalStudents = Object.values(nextGrades).reduce(
  //       (sum, val) => sum + val,
  //       0,
  //     );

  //     const teachersNeeded = Math.ceil(
  //       totalStudents / this.STUDENTS_PER_TEACHER,
  //     );

  //     const fromYear = parseInt(latestYear.split('-')[0]) + i;
  //     const toYear = fromYear + 1;

  //     forecast.push({
  //       schoolYear: `${fromYear}-${toYear}`,
  //       grades: nextGrades,
  //       totalStudents,
  //       teachersNeeded,
  //     });

  //     currentGrades = nextGrades;
  //   }

  //   return {
  //     baselineYear: latestYear,
  //     baselineGrades,
  //     forecast,
  //   };
  // }

  private readonly STUDENTS_PER_TEACHER = 40;

  async generateCohortForecast(enrollments: any[], years: number) {
    const grouped: Record<string, any> = {};

    //  Group data
    enrollments.forEach((record) => {
      const yearKey = `${record.school_year_from}-${record.school_year_to}`;
      const grade = record.grade_level;

      if (!grouped[yearKey]) grouped[yearKey] = {};
      if (!grouped[yearKey][grade]) grouped[yearKey][grade] = 0;

      grouped[yearKey][grade] += record.total_count;
    });

    const yearsList = Object.keys(grouped).sort();
    const latestYear = yearsList[yearsList.length - 1];
    const baselineGrades = { ...grouped[latestYear] };

    // Compute Survival Rates
    const survivalRates: Record<string, number> = {};

    const transitions = [
      ['Grade 7', 'Grade 8'],
      ['Grade 8', 'Grade 9'],
      ['Grade 9', 'Grade 10'],
      ['Grade 10', 'Grade 11'],
      ['Grade 11', 'Grade 12'],
    ];

    transitions.forEach(([fromGrade, toGrade]) => {
      let rates: number[] = [];

      for (let i = 0; i < yearsList.length - 1; i++) {
        const currentYear = yearsList[i];
        const nextYear = yearsList[i + 1];

        const fromValue = grouped[currentYear][fromGrade] || 0;
        const toValue = grouped[nextYear][toGrade] || 0;

        if (fromValue > 0) {
          rates.push(toValue / fromValue);
        }
      }

      survivalRates[fromGrade] =
        rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 1; // fallback 100%
    });

    //  Grade 7 Intake Average
    const last3Years = yearsList.slice(-3);
    const grade7Average =
      last3Years.reduce((sum, yr) => {
        return sum + (grouped[yr]['Grade 7'] || 0);
      }, 0) / last3Years.length;

    let currentGrades = { ...baselineGrades };
    const forecast = [];

    // Forecast Loop
    for (let i = 1; i <= years; i++) {
      const nextGrades: Record<string, number> = {};

      nextGrades['Grade 12'] = Math.round(
        (currentGrades['Grade 11'] || 0) * survivalRates['Grade 11'],
      );

      nextGrades['Grade 11'] = Math.round(
        (currentGrades['Grade 10'] || 0) * survivalRates['Grade 10'],
      );

      nextGrades['Grade 10'] = Math.round(
        (currentGrades['Grade 9'] || 0) * survivalRates['Grade 9'],
      );

      nextGrades['Grade 9'] = Math.round(
        (currentGrades['Grade 8'] || 0) * survivalRates['Grade 8'],
      );

      nextGrades['Grade 8'] = Math.round(
        (currentGrades['Grade 7'] || 0) * survivalRates['Grade 7'],
      );

      nextGrades['Grade 7'] = Math.round(grade7Average);

      const totalStudents = Object.values(nextGrades).reduce(
        (sum, val) => sum + val,
        0,
      );

      const teachersNeeded = Math.ceil(
        totalStudents / this.STUDENTS_PER_TEACHER,
      );

      const fromYear = parseInt(latestYear.split('-')[0]) + i;
      const toYear = fromYear + 1;

      forecast.push({
        schoolYear: `${fromYear}-${toYear}`,
        grades: nextGrades,
        totalStudents,
        teachersNeeded,
      });

      currentGrades = nextGrades;
    }

    return {
      baselineYear: latestYear,
      baselineGrades,
      survivalRates,
      forecast,
    };
  }

  async generateCohortForecastElementary(enrollments: any[], years: number) {
    const grouped: Record<string, any> = {};

    //  Group data
    enrollments.forEach((record) => {
      const yearKey = `${record.school_year_from}-${record.school_year_to}`;
      const grade = record.grade_level;

      if (!grouped[yearKey]) grouped[yearKey] = {};
      if (!grouped[yearKey][grade]) grouped[yearKey][grade] = 0;

      grouped[yearKey][grade] += record.total_count;
    });

    const yearsList = Object.keys(grouped).sort();
    const latestYear = yearsList[yearsList.length - 1];
    const baselineGrades = { ...grouped[latestYear] };

    // Compute Survival Rates
    const survivalRates: Record<string, number> = {};

    const transitions = [
      ['Kindergarten', 'Grade 1'],
      ['Grade 1', 'Grade 2'],
      ['Grade 2', 'Grade 3'],
      ['Grade 3', 'Grade 4'],
      ['Grade 4', 'Grade 5'],
      ['Grade 5', 'Grade 6'],
    ];

    transitions.forEach(([fromGrade, toGrade]) => {
      let rates: number[] = [];

      for (let i = 0; i < yearsList.length - 1; i++) {
        const currentYear = yearsList[i];
        const nextYear = yearsList[i + 1];

        const fromValue = grouped[currentYear][fromGrade] || 0;
        const toValue = grouped[nextYear][toGrade] || 0;

        if (fromValue > 0) {
          rates.push(toValue / fromValue);
        }
      }

      survivalRates[fromGrade] =
        rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 1; // fallback 100%
    });

    //  Grade 7 Intake Average
    const last3Years = yearsList.slice(-3);
    const grade7Average =
      last3Years.reduce((sum, yr) => {
        return sum + (grouped[yr]['Kindergarten'] || 0);
      }, 0) / last3Years.length;

    let currentGrades = { ...baselineGrades };
    const forecast = [];

    // Forecast Loop
    for (let i = 1; i <= years; i++) {
      const nextGrades: Record<string, number> = {};

      nextGrades['Grade 6'] = Math.round(
        (currentGrades['Grade 5'] || 0) * survivalRates['Grade 5'],
      );

      nextGrades['Grade 5'] = Math.round(
        (currentGrades['Grade 4'] || 0) * survivalRates['Grade 4'],
      );

      nextGrades['Grade 4'] = Math.round(
        (currentGrades['Grade 3'] || 0) * survivalRates['Grade 3'],
      );

      nextGrades['Grade 3'] = Math.round(
        (currentGrades['Grade 2'] || 0) * survivalRates['Grade 2'],
      );

      nextGrades['Grade 2'] = Math.round(
        (currentGrades['Grade 1'] || 0) * survivalRates['Grade 1'],
      );

      nextGrades['Grade 1'] = Math.round(
        (currentGrades['Kindergarten'] || 0) * survivalRates['Kindergarten'],
      );

      nextGrades['Kindergarten'] = Math.round(grade7Average);

      const totalStudents = Object.values(nextGrades).reduce(
        (sum, val) => sum + val,
        0,
      );

      const teachersNeeded = Math.ceil(
        totalStudents / this.STUDENTS_PER_TEACHER,
      );

      const fromYear = parseInt(latestYear.split('-')[0]) + i;
      const toYear = fromYear + 1;

      forecast.push({
        schoolYear: `${fromYear}-${toYear}`,
        grades: nextGrades,
        totalStudents,
        teachersNeeded,
      });

      currentGrades = nextGrades;
    }

    return {
      baselineYear: latestYear,
      baselineGrades,
      survivalRates,
      forecast,
    };
  }

  async getEnrollmentChart(sy: number, levelType: string) {
    const raw = await this.dataSource.query(
      `
    SELECT 
      sl.grade_level,
      SUM(CASE WHEN sl.status IS NULL THEN 1 ELSE 0 END) AS enrolled,
      SUM(CASE WHEN sl.status IS NOT NULL THEN 1 ELSE 0 END) AS dropped,
      COUNT(es.id) AS verification

    FROM student_list sl

    LEFT JOIN enroll_student es
      ON es.grade_level = sl.grade_level
      AND es.statusEnrolled = 0
      AND es.isSubmitted = 1
      AND es.school_yearId = ?

    WHERE sl.school_yearId = ?
    GROUP BY sl.grade_level
    `,
      [sy, sy],
    );

    let gradeStructure: string[] = [];

    if (levelType === 'Elementary') {
      gradeStructure = GRADE_STRUCTURE.ELEMENTARY;
    }

    if (levelType === 'Junior High') {
      gradeStructure = GRADE_STRUCTURE.JUNIOR_HIGH;
    }

    if (levelType === 'Senior High') {
      gradeStructure = GRADE_STRUCTURE.SENIOR_HIGH;
    }

    if (levelType === 'High School') {
      gradeStructure = [
        'Grade 7',
        'Grade 8',
        'Grade 9',
        'Grade 10',
        'Grade 11',
        'Grade 12',
      ];
    }

    const formatted = gradeStructure.map((grade) => {
      const found = raw.find((r) => r.grade_level === grade);

      return {
        grade_level: grade,
        enrolled: found ? Number(found.enrolled) : 0,
        dropped: found ? Number(found.dropped) : 0,
        verification: found ? Number(found.verification) : 0,
      };
    });

    let chartData = {
      categories: formatted.map((f) => f.grade_level),
      series: [
        {
          name: 'Verification',
          data: formatted.map((f) => f.verification),
        },
        {
          name: 'Enrolled',
          data: formatted.map((f) => f.enrolled),
        },
        {
          name: 'Dropped',
          data: formatted.map((f) => f.dropped),
        },
      ],
    };
    // console.log(chartData.series);
    return chartData;
  }

  async getCombinedForecasts() {
    const data = await this.dataSource.query(
      `SELECT * FROM student_combinedforecasts`,
    );
    // console.log(data);
    return data;
  }

  async getTeacherRoomNeedForecasts() {
    const data = await this.dataSource.query(
      `SELECT * FROM report_forcasteddata_by_gradelevel`,
    );

    return data;
  }
}
