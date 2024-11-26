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
import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
import { SendNewEmailDto } from './dto/send-new-email.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';

@ApiTags('PDF generator')
@Controller('pdf-generator')
export class PdfGeneratorController {
  constructor(private readonly pdfGeneratorService: PdfGeneratorService) {}

  // @Get('data/:type')
  // async getData(@Param('type') type: number) {
  //   return this.pdfGeneratorService.getData(type);
  // }

  // @Get('/generatePDS/:userdetailID')
  // async getnewpdf(
  //   @Res() res,
  //   @Param('userdetailID') userdetailID: number,
  // ): Promise<void> {
  //   const buffer = await this.pdfGeneratorService.printPDF(userdetailID, false);

  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'inline; filename=example.pdf',
  //     'Content-Length': buffer.length,

  //     // prevent cache
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     Pragma: 'no-cache',
  //     Expires: 0,
  //   });

  //   res.end(buffer);

  //   // console.log(n)
  // }

  // @Get('/generateMyPDS/:userdetailID/:hasPic')
  // async generateMyPDS(
  //   @Res() res,
  //   @Param('userdetailID') userdetailID: number,
  //   @Param('hasPic') hasPic: boolean,
  // ): Promise<void> {
  //   const buffer = await this.pdfGeneratorService.printPDF(
  //     userdetailID,
  //     hasPic,
  //   );

  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'inline; filename=example.pdf',
  //     'Content-Length': buffer.length,

  //     // prevent cache
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     Pragma: 'no-cache',
  //     Expires: 0,
  //   });

  //   res.end(buffer);

  //   // console.log(n)
  // }

  // // @UseGuards(JWTAuthGuard)
  // @Get('/generateDTR/:userdetailID/:mnthyr/:period')
  // async generateDTR(
  //   @Res() res,
  //   @Param('userdetailID') userdetailID: string,
  //   @Param('mnthyr') mnthyr: string,
  //   @Param('period') period: string,
  // ): Promise<void> {
  //   const buffer = await this.pdfGeneratorService.generateDTR(
  //     +userdetailID,
  //     mnthyr,
  //     +period,
  //   );

  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'inline; filename=example.pdf',
  //     'Content-Length': buffer.length,

  //     // prevent cache
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     Pragma: 'no-cache',
  //     Expires: 0,
  //   });

  //   res.end(buffer);

  //   // console.log(n)
  // }
}
