import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { hashPassword } from 'src/auth/utils/bcrypt';
import {
  Users,
  UserType,
} from 'src/entities';

import { UserTypeService } from 'src/user-type/user-type.service';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';
import { UpdateUserCredential } from '../auth/dto/update-user-credential.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { UserDetail } from './entities/user-detail.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreatePDSDto } from './dto/create-pds.dto';
import { create } from 'domain';
import e from 'express';
import { ellipse } from 'pdfkit';
import { UpdatePDSDto } from './dto/update-pds.dto';
import { UpdateMyPDSDto } from './dto/update-my-pds.dto';
import { UpdateVerifiedUser } from './dto/update-verified-user.dto';
import { UserTypeRole } from './dto/update-user-type-role.dto';
import { isNotEmpty } from 'class-validator';
import { empty } from 'rxjs';
import {
  getCurrentDateTimeString,
  trimString,
} from 'src/shared/global-function';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetail)
    private readonly userdetailsRepository: Repository<UserDetail>,
    private authService: AuthService,
    private usertypeService: UserTypeService,
    private dataSource: DataSource,
  ) {}

  async getAllUsersToVerify() {
    let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname)  AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
      ])
      .leftJoinAndMapOne('UD.user', Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.id != 2') //security user ID
      .andWhere('user.isAdminApproved = 0')
      .getRawMany();
    return data;
  }

  async getAllVerifiedUser() {
    let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
      ])
      .leftJoinAndMapOne('UD.user', Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.id != 2') //security user ID
      .andWhere('user.isAdminApproved = 1')
      .getRawMany();

    return data;

  }

  async TeachingRole() {
    let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
      ])
      .leftJoinAndMapOne('UD.user', Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.id != 2') //security user ID
      .andWhere('user.isAdminApproved = 1')
      .andWhere('user.user_roleID = 2')
      .getRawMany();

    return data;

  }

  async updateVerifiedUser(updateVU: UpdateVerifiedUser) {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (updateVU.user_roleID == 5) {
        return {
          msg: 'Request cannot be granted! You cannot add new superadmin.',
          status: HttpStatus.BAD_REQUEST,
        };
      } else {
        await queryRunner.manager.update(Users, updateVU.userID, {
          isAdminApproved: true,
          usertypeID: updateVU.usertypeID,
          user_roleID: updateVU.user_roleID == null ? 3 : updateVU.user_roleID,
          assignedModuleID: updateVU.assignedModuleID,
        });



        await queryRunner.commitTransaction();
        return {
          msg: updateVU.update_type == 1 ? 'User verified.' : 'User updated.',
          status: HttpStatus.OK,
        };
      }
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

  async findAll() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const toReturn = await queryRunner.query(
      'SELECT * FROM user_detail left join users on user_detail.userID = users.id where users.isAdminApproved != "false" order by lname ASC',
    );
    await queryRunner.release();
    return toReturn;
  }
  async getUserProfileImg(curr_user: any) {
    const a = await this.userdetailsRepository
      .createQueryBuilder('ud')
      .select(['ud.profile_img as profile_img'])
      .where('ud.id = :id', { id: curr_user.userdetail.id })
      .getRawOne();

    if (a.profile_img != null) {
      return a;
    } else {
      return { profile_img: 'img_avatar.png' };
    }
  }

 async getPersonalInfo(user: any) {
    
    const id = user.userdetail.id;
    let data =  await this.dataSource
      .createQueryBuilder(UserDetail, 'ud')
      .select([
        'ud.id as id',
        'ud.fname as fname',
        'ud.mname as mname',
        'ud.lname as lname',
        'ud.suffix as suffix',
        'ud.hired as hired',
        'ud.education as education',
        'ud.sex as sex',
        'ud.mobile_no as mobile_no',
        'ud.profile_img as profile_img',
      ])
      .where('ud.id = :id', { id })
      .getRawOne();


      // console.log('Personal Info',data)
      return data;
  }

  async uploadProfileImg(filename: string, user: any) {
    // console.log(user.user[0].id)
    try {
      const imgupload = await this.userdetailsRepository.update(
        user.userdetail.id,
        { profile_img: filename },
      );

      if (imgupload.affected == 1) {
        return {
          msg: 'Saving successful',
          status: HttpStatus.OK,
        };
      } else {
        return {
          msg: 'Saving failed',
          status: HttpStatus.BAD_REQUEST,
        };
      }
    } catch (error) {
      return {
        msg: error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async updateUserDetail(user: any, updateUserDetailDto: UpdateUserDetailDto) {
    try {
      const upd = await this.userdetailsRepository.update(user.userdetail.id, {
        fname: updateUserDetailDto.fname,
        mname: updateUserDetailDto.mname,
        lname: updateUserDetailDto.lname,
        suffix: updateUserDetailDto.suffix,
        sex: updateUserDetailDto.sex,
        mobile_no: updateUserDetailDto.mobile_no,
        hired: updateUserDetailDto.hired,
        education: updateUserDetailDto.education,
      });

      if (upd.affected == 1) {
        return {
          msg: 'Update successful.',
          status: HttpStatus.OK,
        };
      } else {
        return {
          msg: 'Update failed.',
          status: HttpStatus.BAD_REQUEST,
        };
      }
    } catch (error) {
      return {
        msg: error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getTeachingNon() {
    const nonTeaching = await this.userdetailsRepository
      .createQueryBuilder('ud')
      // .leftJoin(Employee, 'e', 'ud.id = e.user_detailID')
      .leftJoin(Users, 'u', 'u.id = ud.userID')
      // .where('e.isActive = :isActive', { isActive: true })
      .andWhere("u.user_roleID = 1")
      .andWhere('u.isValidated = 1')
      .andWhere('u.isAdminApproved = 1')
      .andWhere('ud.id != 2') //security userID
      .getCount();

      
    const teaching = await this.userdetailsRepository
      .createQueryBuilder('ud')
      // .leftJoin(Employee, 'e', 'ud.id = e.user_detailID')
      .leftJoin(Users, 'u', 'u.id = ud.userID')
      // .where('e.isActive = :isActive', { isActive: true })
      .andWhere("u.user_roleID = 2")
      .andWhere('u.isValidated = 1')
      .andWhere('u.isAdminApproved = 1')
      .andWhere('ud.id != 2') //security userID
      .getCount();

      console.log(nonTeaching,teaching);

    return {
      nonTeaching,
      teaching,
    };
  }


  async getMaleFemaleCount() {
    const male = await this.userdetailsRepository
      .createQueryBuilder('ud')
      // .leftJoin(Employee, 'e', 'ud.id = e.user_detailID')
      .leftJoin(Users, 'u', 'u.id = ud.userID')
      // .where('e.isActive = :isActive', { isActive: true })
      .andWhere("ud.sex = 'Male'")
      .andWhere('u.isValidated = 1')
      .andWhere('u.isAdminApproved = 1')
      .andWhere('ud.id != 2') //security userID
      .getCount();
    const female = await this.userdetailsRepository
      .createQueryBuilder('ud')
      // .leftJoin(Employee, 'e', 'ud.id = e.user_detailID')
      .leftJoin(Users, 'u', 'u.id = ud.userID')
      // .where('e.isActive = :isActive', { isActive: true })
      .andWhere("ud.sex = 'Female'")
      .andWhere('u.isValidated = 1')
      .andWhere('u.isAdminApproved = 1')
      .andWhere('ud.id != 2') //security userID
      .getCount();

      console.log( male,
        female,)

    return {
      male,
      female,
    };
  }





  



}
