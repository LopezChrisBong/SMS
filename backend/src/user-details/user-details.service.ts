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
      .andWhere('user.isAdminApproved = 0')
      .getRawMany();

      console.log(data)
    return data;
  }

  


}
