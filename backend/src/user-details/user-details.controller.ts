import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Response,
  UseInterceptors,
  UploadedFile,
  Headers,
  StreamableFile,
  Header,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from 'src/shared/helper';
import { JwtService } from '@nestjs/jwt';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { fileMimetypeFilter } from './validation/file-mimetype-filters';
import { ParseFile } from './validation/parse-file.pipe';
import { SearchUserDetailDto } from './dto/search-userdetail.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreatePDSDto } from './dto/create-pds.dto';
import { UpdatePDSDto } from './dto/update-pds.dto';
import { UpdateMyPDSDto } from './dto/update-my-pds.dto';
import { UpdateVerifiedUser } from './dto/update-verified-user.dto';
import { UserTypeRole } from './dto/update-user-type-role.dto';
import { currentUser } from 'src/shared/jwtDecode';

@ApiTags('User Details')
@Controller('user-details')
export class UserDetailsController {
  constructor(
    private readonly userDetailsService: UserDetailsService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Post('createauth')
  createUser(@Body() createUserAuthDto: CreateUserAuthDto, @Request() req) {
    // return this.userDetailsService.createauth(createUserAuthDto, req.body);
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('getAllUsersToVerify')
  getAllUsersToVerify() {
    return this.userDetailsService.getAllUsersToVerify();
  }

}
