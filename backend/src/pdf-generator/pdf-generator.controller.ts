import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  StreamableFile,
  Response,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';

@ApiTags('PDF generator')
@Controller('pdf-generator')
export class PdfGeneratorController {
  constructor(private readonly pdfGeneratorService: PdfGeneratorService) {}

  @Get('/getMySchedule/:facultyId/:filter')
  async getMySchedule(
    @Res() res,
    @Param('facultyId') facultyId: number,
    @Param('filter') filter: number,
  ): Promise<void> {
    const buffer = await this.pdfGeneratorService.getMySchedule(
      facultyId,
      filter,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);

    // console.log(n)
  }
  
  @Get('/getAllUnderLoadFaculty/:filter/:status')
      async getAllUnderLoadFaculty(
        @Res() res,

        @Param('filter') filter: number,
        @Param('status') status: string,
      ): Promise<void> {
        const buffer = await this.pdfGeneratorService.getAllUnderLoadFaculty(
          filter,
          +status
        );

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=example.pdf',
          'Content-Length': buffer.length,

          // prevent cache
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        });

        res.end(buffer);
      }

  @Get('/getClassProgramm/:filter/:status/:grade/:roomID')
      async getClassProgramm(
        @Res() res,

        @Param('filter') filter: number,
        @Param('status') status: string,
        @Param('grade') grade: string,
        @Param('roomID') roomID: string,
      ): Promise<void> {
        const buffer = await this.pdfGeneratorService.getClassProgramm(
          filter,
          +status,
          grade,
          +roomID
        );

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=example.pdf',
          'Content-Length': buffer.length,

          // prevent cache
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        });

        res.end(buffer);
      }


  

  @Get('getQRCode/:id')
  async getQRCode(@Res() res, @Param('id') id: string): Promise<void> {
    const buffer = await this.pdfGeneratorService.getQRCode(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);

    // console.log(n)
  }

      @Get('/getSchoolForm2/:filter/:roomID/:subjectID/:date/:teacherID')
      async getSchoolForm2(
        @Res() res,
        @Param('filter') filter: number,
        @Param('roomID') roomID: number,
        @Param('subjectID') subjectID: string,
        @Param('date') date: string,
        @Param('teacherID') teacherID: number,
      ): Promise<void> {
        const buffer = await this.pdfGeneratorService.getSchoolForm2(
          filter,
          roomID,
          +subjectID,
          date,
          teacherID
        );
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=example.pdf',
          'Content-Length': buffer.length,

          // prevent cache
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        });

        res.end(buffer);
      }

      @Get('/getAllStudenList/:filter/:roomID/:grade')
      async getAllStudenList(
        @Res() res,
        @Param('filter') filter: number,
        @Param('roomID') roomID: number,
        @Param('grade') grade: string,
      ): Promise<void> {
        const buffer = await this.pdfGeneratorService.getAllStudenList(
          filter,
          roomID,
          grade,
        );
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=example.pdf',
          'Content-Length': buffer.length,

          // prevent cache
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        });

        res.end(buffer);
      }

}
