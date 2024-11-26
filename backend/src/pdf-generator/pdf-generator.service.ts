import { HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
// import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
// import * as PDFDocument from 'pdfkit'
// import { PDFOptions, PDFService } from '@t00nday/nestjs-pdf';

import { DataSource } from 'typeorm';

import { SendNewEmailDto } from './dto/send-new-email.dto';
import {
  Users,
} from 'src/entities';
import { join } from 'path';
import { log } from 'console';
import { scale } from 'pdfkit';
// import {
//   computeTotal,
//   formatActualAccompishment,
//   formatSuccessIndicator,
//   getTotal,
//   loadSummaryHeader,
// } from 'src/ipcr-target/shared-function';
// import newFs
const hbs = require('handlebars');
const QRCode = require('qrcode');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const moment = require('moment');
const fs1 = require('fs');

hbs.registerHelper('dateFormat', function (value) {
  if (value) {
    return moment(value).format('MM/DD/YYYY');
  }
  return;
});

hbs.registerHelper('formatTime', function (time, format = 'h:mm a') {
  if (time) {
    return moment(time).format(format);
  }
  return;
});

hbs.registerHelper('formatAlphanumericDate', function (value) {
  if (value) {
    return moment(value).format('MMMM DD, YYYY');
  }
  return;
});

hbs.registerHelper('toUpperCase', function (value) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return;
});

hbs.registerHelper('concatenate', function (value, value1) {
  return value + '/' + value1;
});

hbs.registerHelper('formatAmount', function (value) {
  const val = (value / 1).toFixed(2).replace(',', '.');
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

hbs.registerHelper('getAnnual', function (value) {
  var annual = 0;
  for (let i = 0; i < 12; i++) {
    annual += parseFloat(value);
  }
  return annual;
});

hbs.registerHelper('curDate', function (formattype) {
  if (formattype == 'numeric') {
    return moment().format('MM/DD/YYYY');
  } else if (formattype == 'alphanumeric') {
    return moment().format('MMMM DD, YYYY');
  }
});

hbs.registerHelper('getPresentDate', function () {
  return moment().format('MM/DD/YY');
});

hbs.registerHelper('formatDate', function (value) {
  return moment(value).format('MM/DD/YY');
});

hbs.registerHelper('sexFormat', function (value) {
  if (value) {
    if (value.toLowerCase() == 'male') {
      return 'M';
    } else if (value.toLowerCase() == 'female') {
      return 'F';
    }
  }
});

hbs.registerHelper('for', function (from, to, incr, block) {
  var accum = '';
  for (var i = from; i < to; i += incr) accum += block.fn(i);
  return accum;
});

hbs.registerHelper('JSONParse', function (value) {
  return JSON.parse(value);
});

hbs.registerHelper('calcAge', function (value) {
  var dob = new Date(value);
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
});

hbs.registerHelper('ifEqual', function (value, conditionVal) {
  return value == conditionVal ? true : false;
});

hbs.registerHelper('formatValueIfNotIsNaN', function (value) {
  if (isNaN(value)) {
    return value;
  } else {
    const val = (value / 1).toFixed(2).replace(',', '.');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
});

hbs.registerHelper('tableDateFormat', function (value) {
  const date = new Date(value);
  const mnthsArr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const d = date.getDate();
  const month = mnthsArr[date.getMonth()];
  const yr = date.getFullYear();
  return d + '-' + month + '-' + yr.toString().substring(2);
});

hbs.registerHelper('getCurrentMonth', function () {
  const date = new Date();
  const mnthsArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = mnthsArr[date.getMonth()];

  return month;
});

hbs.registerHelper('getCurrentYear', function () {
  const date = new Date();
  const yr = date.getFullYear();

  return yr;
});

hbs.registerHelper('getPrevYear', function () {
  const date = new Date();
  const yr = date.getFullYear() - 1;

  return yr;
});

hbs.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('getObject', function (arr, index) {
  return arr[index];
});

hbs.registerHelper('getValue', function (arr, data) {
  return arr.data;
});

hbs.registerHelper('ifAns', function (v1, v2, options) {
  if (v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifCount', function (v1, v2, options) {
  if (v1 > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('isNotNull', function (v1, options) {
  if (v1 != null) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('isNotNullAndNotNAandNotEmpty', function (v1, options) {
  if (
    v1 != null &&
    v1.toString().replace(/\s/g, '').replace(/\t/g, '').toLowerCase() !=
      'n/a' &&
    v1 != ' ' &&
    v1 != ''
  ) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('formatName', function (fname, mname, lname) {
  if (mname) {
    return fname + ' ' + mname[0] + '. ' + lname;
  } else {
    return fname + ' ' + lname;
  }
});

hbs.registerHelper('toTitleCase', function (val) {
  return val.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
});

hbs.registerHelper('getCount', function (val) {
  return val.length;
});

hbs.registerHelper('hasData', function (v1, v2, options) {
  if (v1.length > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('getPercentage', function (val, totalVal) {
  let percentage = (val / totalVal) * 100;
  return percentage.toFixed(2);
});

hbs.registerHelper('formatGovIDDateIssued', function (val) {
  if (val) {
    let dump = val.split('/');
    let str;
    let str1;
    let str2;
    str1 = dump[0] == null || dump[0] == 'null' ? null : dump[0];
    str2 = dump[1] == null || dump[1] == 'null' ? null : dump[1];
    if (str1 && str2) {
      str = str1 + '/' + str2;
    } else if (str1 && !str2) {
      str = str1;
    } else if (!str1 && str2) {
      str = str2;
    } else if (!str1 && !str2) {
      str = 'N/A';
    }
    return str;
  } else {
    return 'N/A';
  }
});

// hbs.registerHelper('compute', function (val1, val2, operator) {
//   //operator must be string;
//   let toReturn;

//   switch (operator) {
//     case 'add':
//       toReturn = val1 + val2;
//       break;
//       case 'subtract':
//         toReturn = val1 - val2;
//       break;
//       case 'multiply':
//         toReturn = val1 * val2;
//       break;

//       case 'divide':
//         toReturn = val1 / val2;
//       break;

//   }

//   return toReturn;
// });

hbs.registerHelper('math', function (lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  return {
    '+': lvalue + rvalue,
  }[operator];
});

@Injectable()
export class PdfGeneratorService {
  constructor(private dataSource: DataSource) {}

  // async compile(templatename, data) {
  //   // //development
  //   //   process.cwd(),
  //   //   'src/pdf-generator/templates',
  //   //   `${templatename}.hbs`,
  //   // );

  //   //hosted filepath for pdf

  //   const filepath = path.join(
  //     __dirname,
  //     '../pdf-generator/templates',
  //     `${templatename}.hbs`,
  //   );

  //   const html = await fs.readFile(filepath, 'utf-8');
  //   return hbs.compile(html)(data);
  // }

  // async getData(type: number) {
  //   // faculty profile (plantilla)
  //   if (type == 1) {
  //     let m = 0;
  //     let f = 0;
  //     let docCnt = 0;
  //     let pursDocCnt = 0;
  //     let mastCnt = 0;
  //     let pursMastCnt = 0;
  //     let bachCnt = 0;
  //     let colVocCnt = 0;
  //     let hsCnt = 0;
  //     let totalCnt = 0;

  //     const grpPos = await this.dataSource
  //       .createQueryBuilder(Employee, 'e')
  //       .select([
  //         'e.instituteID as instituteID',
  //         'ins.name as institute',
  //         'e.positionID as positionID',
  //         'pos.description as position',
  //       ])
  //       .leftJoin(Position, 'pos', 'pos.id = e.positionID')
  //       .leftJoin(Institute, 'ins', 'e.instituteID = ins.id')
  //       .where('e.empStatusID = :esID', { esID: 1 })
  //       .andWhere('e.positionID = :pID', { pID: 2 }) //faculty
  //       .groupBy('e.instituteID')
  //       .getRawMany();

  //     for (let j = 0; j < grpPos.length; j++) {
  //       const el1 = grpPos[j];
  //       // grpPos[j].position = grpPos[j].office;

  //       let data = await this.dataSource
  //         .createQueryBuilder(UserDetail, 'ud')
  //         .select([
  //           'ud.id as id',
  //           'ud.fname as fname',
  //           'ud.lname as lname',
  //           'ud.mname as mname',
  //           'ud.sex as sex',
  //           'ud.bdate as bdate',
  //           'ud.email as email',
  //           'ud.mobile_no as mobile_no',
  //         ])
  //         .leftJoin(Users, 'u', 'u.id = ud.userID')
  //         .leftJoin(Employee, 'e', 'e.user_detailID = ud.id')
  //         .leftJoin(Position, 'pos', 'pos.id = e.positionID')
  //         .leftJoin(EmploymentStatus, 'es', 'e.empStatusID = es.id')
  //         .where('e.empStatusID = :esID', { esID: 1 })
  //         .andWhere('e.positionID = :pID', { pID: el1.positionID })
  //         .andWhere('e.instituteID = :insID', { insID: el1.instituteID })
  //         .andWhere('u.isValidated = :valid', { valid: true })
  //         .andWhere('u.isAdminApproved = :approved', { approved: true })
  //         .addSelect([
  //           'pos.description as position',
  //           'es.description as empStatus',
  //           'e.date_hired as date_hired',
  //         ])
  //         .getRawMany();

  //       for (let i = 0; i < data.length; i++) {
  //         let undergrad = '';
  //         let graduate = '';
  //         let post_grad = '';
  //         const element = data[i];

  //         if (element.sex == 'Male') {
  //           m++;
  //         }
  //         if (element.sex == 'Female') {
  //           f++;
  //         }
  //         var ed = await this.dataSource
  //           .createQueryBuilder(EducBackgroud, 'ed')
  //           .where('ed.user_detailID = :id', { id: element.id })
  //           .getMany();
  //         for (let k = 0; k < ed.length; k++) {
  //           let ed1 = ed[k];
  //           if (ed1.level == 'Graduate Studies') {
  //             if (ed1.grad_study_type == 'Masteral') {
  //               let gs =
  //                 ed1.grad_status == null
  //                   ? ''
  //                   : ed1.grad_status == 'Graduated'
  //                   ? ''
  //                   : '(' + ed1.grad_status + ')';
  //               if (graduate == '') {
  //                 graduate += ed1.educ_course + '' + ' ' + gs;
  //               } else {
  //                 graduate += ', ' + ed1.educ_course + ' ' + gs;
  //               }
  //             } else if (ed1.grad_study_type == 'Doctorate') {
  //               let gs =
  //                 ed1.grad_status == null
  //                   ? ''
  //                   : ed1.grad_status == 'Graduated'
  //                   ? ''
  //                   : '(' + ed1.grad_status + ')';
  //               if (post_grad == '') {
  //                 post_grad += ed1.educ_course + ' ' + gs;
  //               } else {
  //                 post_grad += ', ' + ed1.educ_course + ' ' + gs;
  //               }
  //             }
  //           } else if (ed1.level == 'College') {
  //             if (undergrad == '') {
  //               undergrad += ed1.educ_course;
  //             } else {
  //               undergrad += ', ' + ed1.educ_course;
  //             }
  //           }
  //         }

  //         Object.assign(data[i], { undergrad: undergrad });
  //         Object.assign(data[i], { graduate: graduate });
  //         Object.assign(data[i], { post_grad: post_grad });
  //       }

  //       Object.assign(grpPos[j], {
  //         groupData: { total: { m: m, f: f }, data: data },
  //       });
  //     }
  //     return grpPos;
  //   } else if (type == 2) {
  //     // admin profile (plantilla)
  //     let m = 0;
  //     let f = 0;
  //     let docCnt = 0;
  //     let pursDocCnt = 0;
  //     let mastCnt = 0;
  //     let pursMastCnt = 0;
  //     let bachCnt = 0;
  //     let colVocCnt = 0;
  //     let hsCnt = 0;
  //     let totalCnt = 0;

  //     const grpPos = await this.dataSource
  //       .createQueryBuilder(Employee, 'e')
  //       .select(['e.officeID as officeID', 'o.name as office'])
  //       .leftJoin(Position, 'pos', 'pos.id = e.positionID')
  //       .leftJoin(Office, 'o', 'e.officeID = o.id')
  //       .where('e.empStatusID = :esID', { esID: 1 })
  //       .andWhere('e.positionID != :pID', { pID: 2 }) //faculty
  //       .groupBy('e.officeID')
  //       .getRawMany();

  //     for (let j = 0; j < grpPos.length; j++) {
  //       const el1 = grpPos[j];
  //       // grpPos[j].position = grpPos[j].office;

  //       let data = await this.dataSource
  //         .createQueryBuilder(UserDetail, 'ud')
  //         .select([
  //           'ud.id as id',
  //           'ud.fname as fname',
  //           'ud.lname as lname',
  //           'ud.mname as mname',
  //           'ud.sex as sex',
  //           'ud.bdate as bdate',
  //           'ud.email as email',
  //           'ud.mobile_no as mobile_no',
  //         ])
  //         .leftJoin(Users, 'u', 'u.id = ud.userID')
  //         .leftJoin(Employee, 'e', 'e.user_detailID = ud.id')
  //         .leftJoin(Position, 'pos', 'pos.id = e.positionID')
  //         .leftJoin(EmploymentStatus, 'es', 'e.empStatusID = es.id')
  //         .where('e.empStatusID = :esID', { esID: 1 })
  //         .andWhere('e.officeID = :oID', { oID: el1.officeID })
  //         .andWhere('u.isValidated = :valid', { valid: true })
  //         .andWhere('u.isAdminApproved = :approved', { approved: true })
  //         .addSelect([
  //           'pos.description as position',
  //           'es.description as empStatus',
  //           'e.date_hired as date_hired',
  //         ])
  //         .getRawMany();

  //       for (let i = 0; i < data.length; i++) {
  //         let undergrad = '';
  //         let graduate = '';
  //         let post_grad = '';
  //         const element = data[i];

  //         if (element.sex == 'Male') {
  //           m++;
  //         }
  //         if (element.sex == 'Female') {
  //           f++;
  //         }
  //         var ed = await this.dataSource
  //           .createQueryBuilder(EducBackgroud, 'ed')
  //           .where('ed.user_detailID = :id', { id: element.id })
  //           .getMany();
  //         for (let k = 0; k < ed.length; k++) {
  //           let ed1 = ed[k];
  //           if (ed1.level == 'Graduate Studies') {
  //             if (ed1.grad_study_type == 'Masteral') {
  //               let gs =
  //                 ed1.grad_status == null
  //                   ? ''
  //                   : ed1.grad_status == 'Graduated'
  //                   ? ''
  //                   : '(' + ed1.grad_status + ')';
  //               if (graduate == '') {
  //                 graduate += ed1.educ_course + '' + ' ' + gs;
  //               } else {
  //                 graduate += ', ' + ed1.educ_course + ' ' + gs;
  //               }
  //             } else if (ed1.grad_study_type == 'Doctorate') {
  //               let gs =
  //                 ed1.grad_status == null
  //                   ? ''
  //                   : ed1.grad_status == 'Graduated'
  //                   ? ''
  //                   : '(' + ed1.grad_status + ')';
  //               if (post_grad == '') {
  //                 post_grad += ed1.educ_course + ' ' + gs;
  //               } else {
  //                 post_grad += ', ' + ed1.educ_course + ' ' + gs;
  //               }
  //             }
  //           } else if (ed1.level == 'College') {
  //             if (undergrad == '') {
  //               undergrad += ed1.educ_course;
  //             } else {
  //               undergrad += ', ' + ed1.educ_course;
  //             }
  //           }
  //         }

  //         Object.assign(data[i], { undergrad: undergrad });
  //         Object.assign(data[i], { graduate: graduate });
  //         Object.assign(data[i], { post_grad: post_grad });
  //       }

  //       Object.assign(grpPos[j], {
  //         groupData: { total: { m: m, f: f }, data: data },
  //       });
  //     }
  //     return grpPos;
  //   } else if (type == 3) {
  //     // JO Staff & utility
  //     let m = 0;
  //     let f = 0;
  //     let docCnt = 0;
  //     let pursDocCnt = 0;
  //     let mastCnt = 0;
  //     let pursMastCnt = 0;
  //     let bachCnt = 0;
  //     let colVocCnt = 0;
  //     let hsCnt = 0;
  //     let totalCnt = 0;

  //     const grpPos = await this.dataSource
  //       .createQueryBuilder(Employee, 'e')
  //       .select(['e.positionID as positionID', 'pos.description as position'])
  //       .leftJoin(Position, 'pos', 'pos.id = e.positionID')
  //       .where('e.empStatusID = :esID', { esID: 5 })
  //       .andWhere('e.positionID != :pID', { pID: 2 }) //faculty
  //       .groupBy('e.positionID')
  //       .getRawMany();

  //     for (let j = 0; j < grpPos.length; j++) {
  //       const el1 = grpPos[j];
  //       grpPos[j].position = 'JO - ' + grpPos[j].position;

  //       let data = await this.dataSource
  //         .createQueryBuilder(UserDetail, 'ud')
  //         .select([
  //           'ud.id as id',
  //           'ud.fname as fname',
  //           'ud.lname as lname',
  //           'ud.mname as mname',
  //           'ud.sex as sex',
  //           'ud.bdate as bdate',
  //           'ud.email as email',
  //           'ud.mobile_no as mobile_no',
  //         ])
  //         .leftJoin(Users, 'u', 'u.id = ud.userID')
  //         .leftJoin(Employee, 'e', 'e.user_detailID = ud.id')
  //         .leftJoin(Position, 'pos', 'pos.id = e.positionID')
  //         .leftJoin(EmploymentStatus, 'es', 'e.empStatusID = es.id')
  //         .where('e.empStatusID = :esID', { esID: 5 })
  //         .andWhere('e.positionID = :pID', { pID: el1.positionID })
  //         .andWhere('u.isValidated = :valid', { valid: true })
  //         .andWhere('u.isAdminApproved = :approved', { approved: true })
  //         .addSelect([
  //           'pos.description as position',
  //           'es.description as empStatus',
  //           'e.date_hired as date_hired',
  //         ])
  //         .getRawMany();

  //       for (let i = 0; i < data.length; i++) {
  //         let undergrad = '';
  //         let graduate = '';
  //         let post_grad = '';
  //         const element = data[i];

  //         if (element.sex == 'Male') {
  //           m++;
  //         }
  //         if (element.sex == 'Female') {
  //           f++;
  //         }
  //         var ed = await this.dataSource
  //           .createQueryBuilder(EducBackgroud, 'ed')
  //           .where('ed.user_detailID = :id', { id: element.id })
  //           .getMany();
  //         for (let k = 0; k < ed.length; k++) {
  //           let ed1 = ed[k];
  //           if (ed1.level == 'Graduate Studies') {
  //             if (ed1.grad_study_type == 'Masteral') {
  //               let gs =
  //                 ed1.grad_status == null
  //                   ? ''
  //                   : ed1.grad_status == 'Graduated'
  //                   ? ''
  //                   : '(' + ed1.grad_status + ')';
  //               if (graduate == '') {
  //                 graduate += ed1.educ_course + '' + ' ' + gs;
  //               } else {
  //                 graduate += ', ' + ed1.educ_course + ' ' + gs;
  //               }
  //             } else if (ed1.grad_study_type == 'Doctorate') {
  //               let gs =
  //                 ed1.grad_status == null
  //                   ? ''
  //                   : ed1.grad_status == 'Graduated'
  //                   ? ''
  //                   : '(' + ed1.grad_status + ')';
  //               if (post_grad == '') {
  //                 post_grad += ed1.educ_course + ' ' + gs;
  //               } else {
  //                 post_grad += ', ' + ed1.educ_course + ' ' + gs;
  //               }
  //             }
  //           } else if (ed1.level == 'College') {
  //             if (undergrad == '') {
  //               undergrad += ed1.educ_course;
  //             } else {
  //               undergrad += ', ' + ed1.educ_course;
  //             }
  //           }
  //         }

  //         Object.assign(data[i], { undergrad: undergrad });
  //         Object.assign(data[i], { graduate: graduate });
  //         Object.assign(data[i], { post_grad: post_grad });
  //       }

  //       Object.assign(grpPos[j], {
  //         groupData: { total: { m: m, f: f }, data: data },
  //       });
  //     }
  //     return grpPos;
  //   } else if (type == 4) {
  //     // faculty profile under COS
  //     let m = 0;
  //     let f = 0;
  //     let docCnt = 0;
  //     let pursDocCnt = 0;
  //     let mastCnt = 0;
  //     let pursMastCnt = 0;
  //     let bachCnt = 0;
  //     let colVocCnt = 0;
  //     let hsCnt = 0;
  //     let totalCnt = 0;

  //     const grpPos = await this.dataSource
  //       .createQueryBuilder(Employee, 'e')
  //       .select([
  //         'e.positionID as positionID',
  //         'pos.description as position',
  //         'ins.name',
  //       ])
  //       .leftJoin(Position, 'pos', 'pos.id = e.positionID')
  //       .leftJoin(Institute, 'ins', 'ins.id = e.instituteID')
  //       .where('e.empStatusID = :esID', { esID: 4 })
  //       .andWhere('e.positionID = :pID', { pID: 2 }) //faculty
  //       .groupBy('e.instituteID')
  //       .addGroupBy('e.positionID')
  //       .getRawMany();

  //     for (let j = 0; j < grpPos.length; j++) {
  //       const el1 = grpPos[j];
  //       grpPos[j].position = 'COS - ' + grpPos[j].position;

  //       let data = await this.dataSource
  //         .createQueryBuilder(UserDetail, 'ud')
  //         .select([
  //           'ud.id as id',
  //           'ud.fname as fname',
  //           'ud.lname as lname',
  //           'ud.mname as mname',
  //           'ud.sex as sex',
  //           'ud.bdate as bdate',
  //           'ud.email as email',
  //           'ud.mobile_no as mobile_no',
  //         ])
  //         .leftJoin(Users, 'u', 'u.id = ud.userID')
  //         .leftJoin(Employee, 'e', 'e.user_detailID = ud.id')
  //         .leftJoin(Position, 'pos', 'pos.id = e.positionID')
  //         .leftJoin(EmploymentStatus, 'es', 'e.empStatusID = es.id')
  //         .where('e.empStatusID = :esID', { esID: 4 })
  //         .andWhere('e.positionID = :pID', { pID: el1.positionID })
  //         .andWhere('u.isValidated = :valid', { valid: true })
  //         .andWhere('u.isAdminApproved = :approved', { approved: true })
  //         .addSelect([
  //           'pos.description as position',
  //           'es.description as empStatus',
  //           'e.date_hired as date_hired',
  //         ])
  //         .getRawMany();

  //       for (let i = 0; i < data.length; i++) {
  //         let undergrad = '';
  //         let graduate = '';
  //         let post_grad = '';
  //         const element = data[i];

  //         if (element.sex == 'Male') {
  //           m++;
  //         }
  //         if (element.sex == 'Female') {
  //           f++;
  //         }
  //         var ed = await this.dataSource
  //           .createQueryBuilder(EducBackgroud, 'ed')
  //           .where('ed.user_detailID = :id', { id: element.id })
  //           .getMany();
  //         for (let k = 0; k < ed.length; k++) {
  //           let ed1 = ed[k];
  //           if (ed1.level == 'Graduate Studies') {
  //             if (ed1.grad_study_type == 'Masteral') {
  //               let gs =
  //                 ed1.grad_status == null
  //                   ? ''
  //                   : ed1.grad_status == 'Graduated'
  //                   ? ''
  //                   : '(' + ed1.grad_status + ')';
  //               if (graduate == '') {
  //                 graduate += ed1.educ_course + '' + ' ' + gs;
  //               } else {
  //                 graduate += ', ' + ed1.educ_course + ' ' + gs;
  //               }
  //             } else if (ed1.grad_study_type == 'Doctorate') {
  //               let gs =
  //                 ed1.grad_status == null
  //                   ? ''
  //                   : ed1.grad_status == 'Graduated'
  //                   ? ''
  //                   : '(' + ed1.grad_status + ')';
  //               if (post_grad == '') {
  //                 post_grad += ed1.educ_course + ' ' + gs;
  //               } else {
  //                 post_grad += ', ' + ed1.educ_course + ' ' + gs;
  //               }
  //             }
  //           } else if (ed1.level == 'College') {
  //             if (undergrad == '') {
  //               undergrad += ed1.educ_course;
  //             } else {
  //               undergrad += ', ' + ed1.educ_course;
  //             }
  //           }
  //         }

  //         Object.assign(data[i], { undergrad: undergrad });
  //         Object.assign(data[i], { graduate: graduate });
  //         Object.assign(data[i], { post_grad: post_grad });
  //       }

  //       Object.assign(grpPos[j], {
  //         groupData: { total: { m: m, f: f }, data: data },
  //       });
  //     }
  //     return grpPos;
  //   } else if (type == 5) {
  //     return [];
  //   } else if (type == 6) {
  //     let m = 0;
  //     let f = 0;

  //     const grpPos = await this.dataSource
  //       .createQueryBuilder(Employee, 'e')
  //       .select(['e.positionID as positionID', 'pos.description as position'])
  //       .leftJoin(Position, 'pos', 'pos.id = e.positionID')
  //       .where('e.empStatusID = :esID', { esID: 4 })
  //       .andWhere('e.positionID != :pID', { pID: 2 }) //faculty
  //       .andWhere('e.positionID != :pID1', { pID1: 8 }) //utility
  //       .groupBy('e.positionID')
  //       .getRawMany();

  //     for (let j = 0; j < grpPos.length; j++) {
  //       const el1 = grpPos[j];
  //       grpPos[j].position = 'COS - ' + grpPos[j].position;

  //       let data = await this.dataSource
  //         .createQueryBuilder(UserDetail, 'ud')
  //         .select([
  //           'ud.id as id',
  //           'ud.fname as fname',
  //           'ud.lname as lname',
  //           'ud.mname as mname',
  //           'ud.sex as sex',
  //           'ud.bdate as bdate',
  //           'ud.email as email',
  //           'ud.mobile_no as mobile_no',
  //         ])
  //         .leftJoin(Employee, 'e', 'e.user_detailID = ud.id')
  //         .leftJoin(Position, 'pos', 'pos.id = e.positionID')
  //         .leftJoin(EmploymentStatus, 'es', 'e.empStatusID = es.id')
  //         .leftJoin(Users, 'u', 'u.id = ud.userID')
  //         .where('e.empStatusID = :esID', { esID: 4 })
  //         .andWhere('e.positionID = :pID', { pID: el1.positionID })
  //         .andWhere('u.isValidated = 1')
  //         .andWhere('u.isAdminApproved = 1')
  //         .addSelect([
  //           'pos.description as position',
  //           'es.description as empStatus',
  //           'e.date_hired as date_hired',
  //         ])
  //         .getRawMany();

  //       for (let i = 0; i < data.length; i++) {
  //         let undergrad = '';
  //         let graduate = '';
  //         let post_grad = '';
  //         const element = data[i];

  //         if (element.sex == 'Male') {
  //           m++;
  //         }
  //         if (element.sex == 'Female') {
  //           f++;
  //         }
  //         var ed = await this.dataSource
  //           .createQueryBuilder(EducBackgroud, 'ed')
  //           .where('ed.user_detailID = :id', { id: element.id })
  //           .orderBy('ed.level', 'DESC')
  //           .addOrderBy('ed.grad_study_type')
  //           .getMany();
  //         for (let k = 0; k < ed.length; k++) {
  //           let ed1 = ed[k];
  //           if (ed1.level == 'Graduate Studies') {
  //             if (ed1.grad_study_type == 'Masteral') {
  //               let gs =
  //                 ed1.grad_status != 'Graduated' || ed1.grad_status != null
  //                   ? '(' + ed1.grad_status + ')'
  //                   : '';
  //               if (graduate == '') {
  //                 graduate += ed1.educ_course + '' + ' ' + gs;
  //               } else {
  //                 graduate += ', ' + ed1.educ_course + ' ' + gs;
  //               }
  //             } else if (ed1.grad_study_type == 'Doctorate') {
  //               let gs =
  //                 ed1.grad_status != 'Graduated' || ed1.grad_status != null
  //                   ? '(' + ed1.grad_status + ')'
  //                   : '';
  //               if (post_grad == '') {
  //                 post_grad += ed1.educ_course + ' ' + gs;
  //               } else {
  //                 post_grad += ', ' + ed1.educ_course + ' ' + gs;
  //               }
  //             }
  //           } else if (ed1.level == 'College') {
  //             if (undergrad == '') {
  //               undergrad += ed1.educ_course;
  //             } else {
  //               undergrad += ', ' + ed1.educ_course;
  //             }
  //           }
  //         }
  //         let comp = await this.getStatsCount(ed);
  //         console.log(comp);
  //         Object.assign(data[i], { undergrad: undergrad });
  //         Object.assign(data[i], { graduate: graduate });
  //         Object.assign(data[i], { post_grad: post_grad });
  //       }

  //       Object.assign(grpPos[j], {
  //         groupData: { total: { m: m, f: f }, data: data },
  //       });
  //     }
  //     return grpPos;
  //   }
  // }

  // async getStatsCount(data: any) {
  //   let purDoc = 0;
  //   let doc = 0;
  //   let purMst = 0;
  //   let mst = 0;
  //   let bacc = 0;
  //   let colVoc = 0;
  //   let hsGradLvl = 0;

  //   // console.log(data)
  //   if (data.length > 0) {
  //     for (let i = 0; i < data.length; i++) {
  //       const element = data[i];

  //       // first condition is for graduate studies
  //       if (element.level == 'Graduate Studies') {
  //         // condition for doctorate
  //         if (element.grad_study_type == 'Doctorate') {
  //           if (element.grad_status == 'Graduated') {
  //             doc++;
  //           } else if (
  //             element.grad_status == 'On-going' ||
  //             element.grad_status == 'CAR'
  //           ) {
  //             purDoc++;
  //           }
  //         } else if (element.grad_study_type == 'Masteral') {
  //           if (element.grad_status == 'Graduated') {
  //             mst++;
  //           } else if (
  //             element.grad_status == 'On-going' ||
  //             element.grad_status == 'CAR'
  //           ) {
  //             purMst++;
  //           }
  //         }
  //       } else if (element.level == 'College') {
  //         if (element.year_graduated) {
  //           bacc++;
  //         } else {
  //           colVoc++;
  //         }
  //       } else if (element.level == 'Vocational') {
  //         colVoc++;
  //       } else if (element.level == 'Secondary') {
  //         hsGradLvl++;
  //       }
  //     }
  //     if (purDoc > 0) {
  //       return {
  //         purdoc: 1,
  //         doc: 0,
  //         purmst: 0,
  //         mst: 0,
  //         bacc: 0,
  //         colvoc: 0,
  //         hsLvl: 0,
  //       };
  //     } else if (doc > 0) {
  //       return {
  //         purdoc: 0,
  //         doc: 1,
  //         purmst: 0,
  //         mst: 0,
  //         bacc: 0,
  //         colvoc: 0,
  //         hsLvl: 0,
  //       };
  //     } else if (purMst > 0) {
  //       return {
  //         purdoc: 0,
  //         doc: 0,
  //         purmst: 1,
  //         mst: 0,
  //         bacc: 0,
  //         colvoc: 0,
  //         hsLvl: 0,
  //       };
  //     } else if (mst > 0) {
  //       return {
  //         purdoc: 0,
  //         doc: 0,
  //         purmst: 0,
  //         mst: 1,
  //         bacc: 0,
  //         colvoc: 0,
  //         hsLvl: 0,
  //       };
  //     } else if (bacc > 0) {
  //       return {
  //         purdoc: 0,
  //         doc: 0,
  //         purmst: 0,
  //         mst: 0,
  //         bacc: 1,
  //         colvoc: 0,
  //         hsLvl: 0,
  //       };
  //     } else if (colVoc > 0) {
  //       return {
  //         purdoc: 0,
  //         doc: 0,
  //         purmst: 0,
  //         mst: 0,
  //         bacc: 0,
  //         colvoc: 1,
  //         hsLvl: 0,
  //       };
  //     } else if (hsGradLvl > 0) {
  //       return {
  //         purdoc: 0,
  //         doc: 0,
  //         purmst: 0,
  //         mst: 0,
  //         bacc: 0,
  //         colvoc: 0,
  //         hsLvl: 1,
  //       };
  //     }
  //   } else {
  //     return {
  //       purdoc: 0,
  //       doc: 0,
  //       purmst: 0,
  //       mst: 0,
  //       bacc: 0,
  //       colvoc: 0,
  //       hsLvl: 1,
  //     };
  //   }
  // }

  // generation of PDS
  // async printPDF(id: number, hasPic: boolean): Promise<Buffer> {
  //   const getfamily_background = await this.dataSource.manager
  //     .createQueryBuilder(FamilyBackground, 'fb')
  //     .where('fb.user_detailID= :id', { id })
  //     .getOne();
  //   const getchildren = await this.dataSource.manager
  //     .createQueryBuilder(Child, 'child')
  //     .where('child.user_detailID= :id', { id })
  //     .orderBy('child.bdate', 'DESC')
  //     .getMany();
  //   const geteduc_background = await this.dataSource.manager
  //     .createQueryBuilder(EducBackgroud, 'eb')
  //     .where('eb.user_detailID= :id', { id })
  //     .orderBy('eb.educ_to', 'ASC')
  //     .getMany();
  //   const getcs_eligibility = await this.dataSource.manager
  //     .createQueryBuilder(CsEligibility, 'cs')
  //     .where('cs.user_detailID= :id', { id })
  //     .orderBy('cs.conferment_date', 'DESC')
  //     .getMany();
  //   const getwork_exp = await this.dataSource.manager
  //     .createQueryBuilder(WorkExperience, 'we')
  //     .where('we.user_detailID= :id', { id })
  //     .orderBy('we.date_from', 'DESC')
  //     .getMany();
  //   const getvoluntary_work = await this.dataSource.manager
  //     .createQueryBuilder(VoluntaryWork, 'vw')
  //     .where('vw.user_detailID= :id', { id })
  //     .getMany();
  //   const getlearning_and_development = await this.dataSource.manager
  //     .createQueryBuilder(LearningAndDevelopment, 'lnd')
  //     .where('lnd.user_detailID= :id', { id })
  //     .orderBy('lnd.date_to', 'DESC')
  //     .getMany();
  //   // const getother_infos = await this.dataSource.createQueryBuilder(OtherInfo, 'oi').where("oi.user_detailID= :id", { id }).getMany();
  //   const getother_infosSS = await this.dataSource.manager
  //     .createQueryBuilder(OtherInfoSpecialSkill, 'ois')
  //     .where('ois.user_detailID= :id', { id })
  //     .getMany();
  //   const getother_infosNA = await this.dataSource.manager
  //     .createQueryBuilder(OtherInfoNonAcad, 'oin')
  //     .where('oin.user_detailID= :id', { id })
  //     .getMany();
  //   const getother_infosAM = await this.dataSource.manager
  //     .createQueryBuilder(OtherInfoAssocMembership, 'oia')
  //     .where('oia.user_detailID= :id', { id })
  //     .getMany();
  //   const getpersonal_question_answer = await this.dataSource.manager
  //     .createQueryBuilder(PersonalQuestionAnswer, 'pqa')
  //     .where('pqa.user_detailID= :id', { id })
  //     .orderBy('pqa.pq_id', 'ASC')
  //     .getMany();
  //   const getreferences = await this.dataSource.manager
  //     .createQueryBuilder(Reference, 'refer')
  //     .where('refer.user_detailID= :id', { id })
  //     .getMany();
  //   const getgov_issued_id = await this.dataSource.manager
  //     .createQueryBuilder(GovIssuedId, 'gi')
  //     .where('gi.user_detailID= :id', { id })
  //     .getOne();
  //   const getuser = await this.dataSource.manager
  //     .createQueryBuilder(UserDetail, 'user')
  //     .leftJoinAndMapOne('user.country', Country, 'c', 'user.country = c.id')
  //     .where('user.id = :id', { id })
  //     .getOne();

  //   const getEsign = await this.dataSource.manager
  //     .createQueryBuilder(ESig, 'esig')
  //     .where('esig.user_detailID= :id', { id })
  //     .getOne();

  //   var largest = 0;
  //   var oss1 = JSON.stringify(getother_infosSS);
  //   var oss = JSON.parse(oss1);
  //   var ona1 = JSON.stringify(getother_infosNA);
  //   var ona = JSON.parse(ona1);
  //   var oam1 = JSON.stringify(getother_infosAM);
  //   var oam = JSON.parse(oam1);
  //   let newOtherInfo = [];
  //   console.log(oss.length, ona.length, oam.length);

  //   largest = oss.length;

  //   if (ona.length > largest) {
  //     largest = ona.length;
  //   }
  //   if (oam.length > largest) {
  //     largest = oam.length;
  //   }

  //   // console.log(largest)

  //   for (let i = 0; i < largest; i++) {
  //     let hobbies = '';
  //     let non_acad_distinction = '';
  //     let org_membership = '';

  //     if (oss.length > 0) {
  //       if (oss[i]) {
  //         hobbies = oss[i].hobbies;
  //       }
  //     }

  //     if (ona.length > 0) {
  //       if (ona[i]) {
  //         non_acad_distinction = ona[i].non_acad_distinction;
  //       }
  //     }

  //     if (oam.length > 0) {
  //       if (oam[i]) {
  //         org_membership = oam[i].org_membership;
  //       }
  //     }

  //     newOtherInfo.push({
  //       hobbies: hobbies,
  //       non_acad_distinction: non_acad_distinction,
  //       org_membership: org_membership,
  //     });
  //   }
  //   // console.log(getuser)

  //   Object.assign(getuser, { family_background: getfamily_background });
  //   Object.assign(getuser, { children: getchildren });
  //   Object.assign(getuser, { educ_background: geteduc_background });
  //   Object.assign(getuser, { cs_eligibility: getcs_eligibility });
  //   Object.assign(getuser, { work_exp: getwork_exp });
  //   Object.assign(getuser, { voluntary_work: getvoluntary_work });
  //   Object.assign(getuser, {
  //     learning_and_development: getlearning_and_development,
  //   });
  //   // Object.assign(getuser, { "other_infos": getother_infos });
  //   Object.assign(getuser, {
  //     personal_question_answer: getpersonal_question_answer,
  //   });
  //   Object.assign(getuser, { references: getreferences });
  //   Object.assign(getuser, { gov_issued_id: getgov_issued_id });

  //   var dump = JSON.stringify(getuser);
  //   var dump1 = JSON.parse(dump);
  //   var numPage = 4;

  //   var userDetail = {
  //     fname: dump1.fname,
  //     mname: dump1.mname,
  //     lname: dump1.lname,
  //     suffix: dump1.suffix,
  //     bdate: dump1.bdate,
  //     birth_place: dump1.birth_place,
  //     sex: dump1.sex,
  //     email: dump1.email,
  //     civil_status: dump1.civil_status,
  //     civil_status_others: dump1.civil_status_others,
  //     height: dump1.height,
  //     weight: dump1.weight,
  //     blood_type: dump1.blood_type,
  //     GSIS: dump1.GSIS,
  //     PHILHEALTH: dump1.PHILHEALTH,
  //     PAGIBIG: dump1.PAGIBIG,
  //     SSS: dump1.SSS,
  //     TIN: dump1.TIN,
  //     agency_employee_num: dump1.agency_employee_num,
  //     is_dual_citizen: dump1.is_dual_citizen,
  //     citizenship: dump1.citizenship,
  //     citizenship_type: dump1.citizenship_type,
  //     country: dump1.country ? dump1.country.name : null,
  //     tel_no: dump1.tel_no,
  //     mobile_no: dump1.mobile_no,
  //     residential_zip: dump1.residential_zip,
  //     residential_house_no: dump1.residential_house_no,
  //     residential_street: dump1.residential_street,
  //     residential_subd: dump1.residential_subd,
  //     residential_brgy: dump1.residential_brgy,
  //     residential_city: dump1.residential_city,
  //     residential_prov: dump1.residential_prov,
  //     permanent_zip: dump1.permanent_zip,
  //     permanent_house_no: dump1.permanent_house_no,
  //     permanent_street: dump1.permanent_street,
  //     permanent_subd: dump1.permanent_subd,
  //     permanent_brgy: dump1.permanent_brgy,
  //     permanent_city: dump1.permanent_city,
  //     permanent_prov: dump1.permanent_prov,
  //   };

  //   var family_background = {
  //     father_fname: dump1.family_background
  //       ? dump1.family_background.father_fname
  //       : null,
  //     father_mname: dump1.family_background
  //       ? dump1.family_background.father_mname
  //       : null,
  //     father_lname: dump1.family_background
  //       ? dump1.family_background.father_lname
  //       : null,
  //     father_suffix: dump1.family_background
  //       ? dump1.family_background.father_suffix
  //       : null,
  //     mother_fname: dump1.family_background
  //       ? dump1.family_background.mother_fname
  //       : null,
  //     mother_mname: dump1.family_background
  //       ? dump1.family_background.mother_mname
  //       : null,
  //     mother_lname: dump1.family_background
  //       ? dump1.family_background.mother_lname
  //       : null,
  //     spouse_fname: dump1.family_background
  //       ? dump1.family_background.spouse_fname
  //       : null,
  //     spouse_mname: dump1.family_background
  //       ? dump1.family_background.spouse_mname
  //       : null,
  //     spouse_lname: dump1.family_background
  //       ? dump1.family_background.spouse_lname
  //       : null,
  //     spouse_suffix: dump1.family_background
  //       ? dump1.family_background.spouse_suffix
  //       : null,
  //     occupation: dump1.family_background
  //       ? dump1.family_background.occupation
  //       : null,
  //     employer_name: dump1.family_background
  //       ? dump1.family_background.employer_name
  //       : null,
  //     employer_address: dump1.family_background
  //       ? dump1.family_background.employer_address
  //       : null,
  //     tel_no: dump1.family_background ? dump1.family_background.tel_no : null,
  //   };

  //   var children = [];
  //   var children1 = [];
  //   var childLength = 12;
  //   var excessChild = 0;
  //   var excessChild1 = 0;

  //   let childArr = [];
  //   let dumpChildArr = [];

  //   childArr = dump1.children;
  //   let cc = dump1.children.length / childLength;
  //   let childDivide = Math.ceil(cc);

  //   if (dump1.children.length > childLength) {
  //     // numPage++;
  //     // var cnt = 0;
  //     // for (let i = 0; i < childLength; i++) {
  //     //   let child = dump1.children[i];
  //     //   children.push({
  //     //     name: child.name,
  //     //     bdate: child.bdate,
  //     //   });
  //     // }
  //     // for (let j = childLength; j < dump1.children.length; j++) {
  //     //   let child = dump1.children[j];
  //     //   children1.push({
  //     //     name: child.name,
  //     //     bdate: child.bdate,
  //     //   });
  //     //   cnt++;
  //     // }
  //     // excessChild1 = childLength - cnt;
  //     numPage += childDivide - 1;
  //     for (let i = 0; i < childDivide; i++) {
  //       if (i == 0) {
  //         children = childArr.slice(i, childLength);
  //       } else {
  //         dumpChildArr = childArr.slice(childLength * i, childLength * (i + 1));

  //         if (dumpChildArr.length >= childLength) {
  //           children1.push(dumpChildArr);
  //         } else {
  //           let len = childLength - dumpChildArr.length;
  //           for (let j = 0; j < len; j++) {
  //             dumpChildArr.push({
  //               name: null,
  //               bdate: null,
  //             });
  //           }
  //           children1.push(dumpChildArr);
  //           // excessLnd1 = lndLen - cnt;
  //         }
  //       }
  //     }
  //   } else {
  //     //for one page
  //     for (let i = 0; i < dump1.children.length; i++) {
  //       let child = dump1.children[i];
  //       children.push({
  //         name: child.name,
  //         bdate: child.bdate,
  //       });
  //     }
  //     excessChild = childLength - dump1.children.length;
  //   }
  //   // console.log('childDiv', childDivide, numPage);

  //   var educLength = 4;
  //   var excessEducLength = 0;
  //   var excessEducLength1 = 0;
  //   var educ_background = [];
  //   var educ_background1 = [];

  //   let educArr = [];
  //   let dumpEducArr = [];
  //   educArr = dump1.educ_background;
  //   let ee = dump1.educ_background.length / educLength;
  //   let educDivide = Math.ceil(ee);

  //   if (dump1.educ_background.length > educLength) {
  //     // numPage++;
  //     // let cnt = 0;
  //     // for (let i = 0; i < educLength; i++) {
  //     //   let element = dump1.educ_background[i];
  //     //   educ_background.push(element);
  //     // }

  //     // for (let i = educLength; i < dump1.educ_background.length; i++) {
  //     //   let element = dump1.educ_background[i];
  //     //   educ_background1.push(element);
  //     //   cnt++;
  //     // }
  //     // excessEducLength1 = educLength - cnt;
  //     numPage += educDivide - 1;
  //     for (let i = 0; i < educDivide; i++) {
  //       if (i == 0) {
  //         educ_background = educArr.slice(i, educLength);
  //       } else {
  //         dumpEducArr = educArr.slice(educLength * i, educLength * (i + 1));

  //         if (dumpEducArr.length >= educLength) {
  //           educ_background1.push(dumpEducArr);
  //         } else {
  //           // let len = educLength - dumpEducArr.length;
  //           // for (let j = 0; j < len; j++) {
  //           //   dumpEducArr.push({
  //           //     level: null,
  //           //     school_name: null,
  //           //     educ_course: null,
  //           //     educ_from: null,
  //           //     educ_to: null,
  //           //     units_earned: null,
  //           //     year_graduated: null,
  //           //     honors_received: null,
  //           //   });
  //           // }
  //           educ_background1.push(dumpEducArr);
  //           // excessLnd1 = lndLen - cnt;
  //         }
  //       }
  //     }
  //   } else {
  //     for (let i = 0; i < dump1.educ_background.length; i++) {
  //       let element = dump1.educ_background[i];
  //       educ_background.push(element);
  //     }
  //     excessEducLength = educLength - dump1.educ_background.length;
  //   }
  //   // console.log('educDivide', educDivide, numPage);

  //   var cs_eligibility = [];
  //   var cs_eligibility1 = [];
  //   var csEligCount = 7;
  //   var excessCSElig = 0;
  //   var excessCSElig1 = 0;

  //   let csArr = [];
  //   let dumpCSArr = [];
  //   csArr = dump1.cs_eligibility;
  //   let cs = dump1.cs_eligibility.length / csEligCount;
  //   let csDivide = Math.ceil(cs);

  //   if (dump1.cs_eligibility.length > csEligCount) {
  //     // numPage++;
  //     // let cnt = 0;
  //     // for (let i = 0; i < csEligCount; i++) {
  //     //   let element = dump1.cs_eligibility[i];
  //     //   cs_eligibility.push(element);
  //     // }
  //     // for (let i = csEligCount; i < dump1.cs_eligibility.length; i++) {
  //     //   let element = dump1.cs_eligibility[i];
  //     //   cs_eligibility1.push(element);
  //     //   cnt++;
  //     // }
  //     // excessCSElig1 = csEligCount - cnt;
  //     numPage += csDivide - 1;
  //     for (let i = 0; i < csDivide; i++) {
  //       if (i == 0) {
  //         cs_eligibility = csArr.slice(i, csEligCount);
  //       } else {
  //         dumpCSArr = csArr.slice(csEligCount * i, csEligCount * (i + 1));

  //         if (dumpCSArr.length >= csEligCount) {
  //           cs_eligibility1.push(dumpCSArr);
  //         } else {
  //           // let len = csEligCount - dumpCSArr.length;
  //           // for (let j = 0; j < len; j++) {
  //           //   dumpCSArr.push({
  //           //     eligibility_type: null,
  //           //     rating: null,
  //           //     conferment_date: null,
  //           //     conferment_place: null,
  //           //     license_num: null,
  //           //     validity: null,
  //           //   });
  //           // }
  //           cs_eligibility1.push(dumpCSArr);
  //           // excessLnd1 = lndLen - cnt;
  //         }
  //       }
  //     }
  //   } else {
  //     for (let i = 0; i < dump1.cs_eligibility.length; i++) {
  //       let element = dump1.cs_eligibility[i];
  //       cs_eligibility.push(element);
  //     }
  //     excessCSElig = csEligCount - dump1.cs_eligibility.length;
  //   }
  //   // console.log('csDivide', csDivide, numPage);

  //   var work_exp = [];
  //   var work_exp1 = [];
  //   var work_expCount = 25;
  //   var excessWork_exp = 0;
  //   var excessWork_exp1 = 0;

  //   let weArr = [];
  //   let dumpWEArr = [];
  //   weArr = dump1.work_exp;
  //   let we = dump1.work_exp.length / work_expCount;
  //   let weDivide = Math.ceil(we);

  //   if (dump1.work_exp.length > work_expCount) {
  //     // numPage++;
  //     // let cnt = 0;
  //     // for (let i = 0; i < work_expCount; i++) {
  //     //   let element = dump1.work_exp[i];
  //     //   work_exp.push(element);
  //     // }
  //     // for (let i = work_expCount; i < dump1.work_exp.length; i++) {
  //     //   let element = dump1.work_exp[i];
  //     //   work_exp1.push(element);
  //     //   cnt++;
  //     // }
  //     // excessWork_exp1 = work_expCount - cnt;
  //     numPage += weDivide - 1;
  //     for (let i = 0; i < weDivide; i++) {
  //       if (i == 0) {
  //         work_exp = weArr.slice(i, work_expCount);
  //       } else {
  //         dumpWEArr = weArr.slice(work_expCount * i, work_expCount * (i + 1));

  //         if (dumpWEArr.length >= work_expCount) {
  //           work_exp1.push(dumpWEArr);
  //         } else {
  //           // let len = work_expCount - dumpWEArr.length;
  //           // for (let j = 0; j < len; j++) {
  //           //   dumpWEArr.push({
  //           //     date_from: null,
  //           //     is_present_date_to: 0,
  //           //     date_to: null,
  //           //     position: null,
  //           //     company: null,
  //           //     appointment_status: null,
  //           //     month_salary: null,
  //           //     salary_grade: undefined,
  //           //     gov_service: null,
  //           //   });
  //           // }
  //           work_exp1.push(dumpWEArr);
  //           // excessLnd1 = lndLen - cnt;
  //         }
  //       }
  //     }
  //   } else {
  //     for (let i = 0; i < dump1.work_exp.length; i++) {
  //       let element = dump1.work_exp[i];
  //       work_exp.push(element);
  //     }
  //     excessWork_exp = work_expCount - dump1.work_exp.length;
  //   }
  //   // console.log('weDivide', weDivide, numPage);

  //   var voluntary_work = [];
  //   var voluntary_work1 = [];
  //   var excessVolWork = 0;
  //   var excessVolWork1 = 0;
  //   var volWorkLen = 4;

  //   let vwArr = [];
  //   let dumpVWArr = [];
  //   vwArr = dump1.voluntary_work;
  //   let vw = dump1.voluntary_work.length / volWorkLen;
  //   let vwDivide = Math.ceil(vw);

  //   if (dump1.voluntary_work.length > volWorkLen) {
  //     // numPage++;
  //     // let cnt = 0;
  //     // for (let i = 0; i < volWorkLen; i++) {
  //     //   let element = dump1.voluntary_work[i];
  //     //   voluntary_work.push(element);
  //     // }
  //     // for (let i = volWorkLen; i < dump1.voluntary_work.length; i++) {
  //     //   let element = dump1.voluntary_work[i];
  //     //   voluntary_work1.push(element);
  //     //   cnt++;
  //     // }
  //     // excessVolWork1 = volWorkLen - cnt;
  //     numPage += vwDivide - 1;
  //     for (let i = 0; i < vwDivide; i++) {
  //       if (i == 0) {
  //         voluntary_work = vwArr.slice(i, volWorkLen);
  //       } else {
  //         dumpVWArr = vwArr.slice(volWorkLen * i, volWorkLen * (i + 1));

  //         if (dumpVWArr.length >= volWorkLen) {
  //           voluntary_work1.push(dumpVWArr);
  //         } else {
  //           // let len = volWorkLen - dumpVWArr.length;
  //           // for (let j = 0; j < len; j++) {
  //           //   dumpVWArr.push({
  //           //     org_name: null,
  //           //     date_from: null,
  //           //     date_to: null,
  //           //     num_hours: null,
  //           //     position: null,
  //           //   });
  //           // }
  //           voluntary_work1.push(dumpVWArr);
  //         }
  //       }
  //     }
  //   } else {
  //     for (let i = 0; i < dump1.voluntary_work.length; i++) {
  //       let element = dump1.voluntary_work[i];
  //       voluntary_work.push(element);
  //     }
  //     excessVolWork = volWorkLen - dump1.voluntary_work.length;
  //   }
  //   // console.log('vwDivide', vwDivide, numPage);

  //   var learning_and_development = [];
  //   var learning_and_development1 = [];
  //   var excessLnd = 0;
  //   var excessLnd1 = 0;
  //   var lndLen = 14;
  //   // var lndLen = 9;
  //   let lndArr = [];
  //   let dumpLndArr = [];

  //   lndArr = dump1.learning_and_development;
  //   let dd = dump1.learning_and_development.length / lndLen;
  //   let lndDivide = Math.ceil(dd);

  //   if (dump1.learning_and_development.length > lndLen) {
  //     //multiple page lnd
  //     // numPage++;
  //     // let cnt = 0;

  //     // for (let i = 0; i < lndLen; i++) {
  //     //   let element = dump1.learning_and_development[i];
  //     //   learning_and_development.push(element);
  //     // }

  //     // for (let i = lndLen; i < dump1.learning_and_development.length; i++) {
  //     //   let element = dump1.learning_and_development[i];
  //     //   learning_and_development1.push(element);
  //     //   cnt++;
  //     // }
  //     // excessLnd1 = lndLen - cnt;

  //     numPage += lndDivide - 1;
  //     for (let i = 0; i < lndDivide; i++) {
  //       if (i == 0) {
  //         learning_and_development = lndArr.slice(i, lndLen);
  //       } else {
  //         dumpLndArr = lndArr.slice(lndLen * i, lndLen * (i + 1));

  //         if (dumpLndArr.length >= lndLen) {
  //           learning_and_development1.push(dumpLndArr);
  //         } else {
  //           // let len = lndLen - dumpLndArr.length;
  //           // for (let j = 0; j < len; j++) {
  //           //   dumpLndArr.push({
  //           //     title: null,
  //           //     date_from: null,
  //           //     date_to: null,
  //           //     num_hours: null,
  //           //     type: null,
  //           //     conducted_by: null,
  //           //   });
  //           // }
  //           learning_and_development1.push(dumpLndArr);
  //           // excessLnd1 = lndLen - cnt;
  //         }
  //       }
  //     }
  //   } else {
  //     //one page lnd
  //     for (let i = 0; i < dump1.learning_and_development.length; i++) {
  //       let element = dump1.learning_and_development[i];
  //       learning_and_development.push(element);
  //     }
  //     excessLnd = lndLen - dump1.learning_and_development.length;
  //   }
  //   // console.log('lndDivide', lndDivide, numPage);

  //   var other_infos = [];
  //   var other_infos1 = [];
  //   var excessOtherInfo = 0;
  //   var excessOtherInfo1 = 0;
  //   var other_infos_len = 7;
  //   // newOtherInfo;
  //   let otherInfoArr = [];
  //   let dumpOtherInfoArr = [];

  //   otherInfoArr = newOtherInfo;
  //   let oi = newOtherInfo.length / other_infos_len;
  //   let oiDivide = Math.ceil(oi);

  //   if (newOtherInfo.length > other_infos_len) {
  //     // numPage++;
  //     // let cnt = 0;
  //     // for (let i = 0; i < other_infos_len; i++) {
  //     //   let element = newOtherInfo[i];
  //     //   other_infos.push(element);
  //     // }
  //     // for (let i = other_infos_len; i < newOtherInfo.length; i++) {
  //     //   let element = newOtherInfo[i];
  //     //   other_infos1.push(element);
  //     //   cnt++;
  //     // }
  //     // excessOtherInfo1 = other_infos_len - cnt;
  //     numPage += oiDivide - 1;
  //     for (let i = 0; i < oiDivide; i++) {
  //       if (i == 0) {
  //         other_infos = otherInfoArr.slice(i, other_infos_len);
  //       } else {
  //         dumpOtherInfoArr = otherInfoArr.slice(
  //           other_infos_len * i,
  //           other_infos_len * (i + 1),
  //         );

  //         if (dumpOtherInfoArr.length >= other_infos_len) {
  //           other_infos1.push(dumpOtherInfoArr);
  //         } else {
  //           // let len = other_infos_len - dumpOtherInfoArr.length;
  //           // for (let j = 0; j < len; j++) {
  //           //   dumpOtherInfoArr.push({
  //           //     hobbies: null,
  //           //     non_acad_distinction: null,
  //           //     org_membership: null,
  //           //   });
  //           // }
  //           other_infos1.push(dumpOtherInfoArr);
  //           // excessLnd1 = lndLen - cnt;
  //         }
  //       }
  //     }
  //   } else {
  //     for (let i = 0; i < newOtherInfo.length; i++) {
  //       let element = newOtherInfo[i];
  //       other_infos.push(element);
  //     }
  //     excessOtherInfo = other_infos_len - newOtherInfo.length;
  //   }
  //   // console.log('oiDivide', oiDivide, numPage);

  //   // if (dump1.other_infos.length > other_infos_len) {
  //   //   numPage++;
  //   //   let cnt = 0;
  //   //   for (let i = 0; i < other_infos_len; i++) {
  //   //     let element = dump1.other_infos[i];
  //   //     other_infos.push(element)
  //   //   }
  //   //   for (let i = other_infos_len; i < dump1.other_infos.length; i++) {
  //   //     let element = dump1.other_infos[i];
  //   //     other_infos1.push(element)
  //   //     cnt++;
  //   //   }
  //   //   excessOtherInfo1 = other_infos_len - cnt;
  //   // } else {
  //   //   for (let i = 0; i < dump1.other_infos.length; i++) {
  //   //     let element = dump1.other_infos[i];
  //   //     other_infos.push(element)

  //   //   }
  //   //   excessOtherInfo = other_infos_len - dump1.other_infos.length;
  //   // }

  //   var personal_question_answer = {
  //     _1a: dump1.personal_question_answer[0],
  //     _1b: dump1.personal_question_answer[1],
  //     _2a: dump1.personal_question_answer[2],
  //     _2b: dump1.personal_question_answer[3],
  //     _3a: dump1.personal_question_answer[4],
  //     _4a: dump1.personal_question_answer[5],
  //     _5a: dump1.personal_question_answer[6],
  //     _5b: dump1.personal_question_answer[7],
  //     _6a: dump1.personal_question_answer[8],
  //     _7a: dump1.personal_question_answer[9],
  //     _7b: dump1.personal_question_answer[10],
  //     _7c: dump1.personal_question_answer[11],
  //   };

  //   var excessRef = 0;
  //   if (dump1.references.length < 3) {
  //     excessRef = 3 - dump1.references.length;
  //   }

  //   let profile_img;

  //   if (getuser.profile_img) {
  //     profile_img = join(
  //       process.cwd(),
  //       '/../upload_img/' + getuser.profile_img,
  //     );
  //   } else {
  //     profile_img = join(process.cwd(), '/../upload_img/img_avatar.png');
  //   }
  //   // console.log(numPage);
  //   const data = [
  //     {
  //       numPage: numPage,
  //       userdetail: userDetail,
  //       family_background: family_background,
  //       children: children,
  //       children1: children1,
  //       excessChild: excessChild,
  //       excessChild1: excessChild1,
  //       educ_background: educ_background,
  //       educ_background1: educ_background1,
  //       excessEducLength: excessEducLength,
  //       excessEducLength1: excessEducLength1,
  //       cs_eligibility: cs_eligibility,
  //       cs_eligibility1: cs_eligibility1,
  //       excessCSElig: excessCSElig,
  //       excessCSElig1: excessCSElig1,
  //       work_exp: work_exp,
  //       work_exp1: work_exp1,
  //       excessWork_exp: excessWork_exp,
  //       excessWork_exp1: excessWork_exp1,
  //       voluntary_work: voluntary_work,
  //       voluntary_work1: voluntary_work1,
  //       excessVolWork: excessVolWork,
  //       excessVolWork1: excessVolWork1,
  //       learning_and_development: learning_and_development,
  //       learning_and_development1: learning_and_development1,
  //       excessLnd: excessLnd,
  //       excessLnd1: excessLnd1,
  //       other_infos: other_infos,
  //       other_infos1: other_infos1,
  //       excessOtherInfo: excessOtherInfo,
  //       excessOtherInfo1: excessOtherInfo1,
  //       personal_question_answer: personal_question_answer,
  //       references: dump1.references,
  //       excessRef: excessRef,
  //       gov_issued_id: dump1.gov_issued_id,
  //       childLength,
  //       educLength,
  //       csEligCount,
  //       work_expCount,
  //       volWorkLen,
  //       lndLen,
  //       other_infos_len,
  //       hasPic: hasPic,
  //       profileImg: this.base64_encode(profile_img, 'profile'),
  //       // profileImg: getuser.profile_img
  //       //   ? process.env.SERVER +
  //       //     '/user-details/getProfileImg/' +
  //       //     getuser.profile_img
  //       //   : process.env.SERVER + '/user-details/getProfileImg/img_avatar.png',
  //       // hasEsig: getEsign ? true : false,
  //       hasEsig: false,
  //       esign: '',
  //       //  esign: getEsign
  //       //   ? process.env.SERVER + '/e-sigs/getEsign/' + getEsign.esign_filename
  //       //   : '',
  //     },
  //   ];

  //   // console.log(data);

  //   try {
  //     const browser = await puppeteer.launch();
  //     const page = await browser.newPage();

  //     const content = await this.compile('pdf-file', data);

  //     await page.setContent(content);

  //     const buffer = await page.pdf({
  //       format: 'legal',
  //       // displayHeaderFooter: true,
  //       // footerTemplate:
  //       //   '<div><div class="pageNumber"></div> <div>/</div><div class="totalPages"></div></div>',
  //       margin: {
  //         top: '0.08in',
  //         left: '0.08in',
  //         bottom: '0.08in',
  //         right: '0.08in',
  //       },
  //       printBackground: true,
  //     });
  //     console.log('PDF generated');
  //     await browser.close();
  //     return buffer;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }



  // base64_encode(file, type) {
  //   // read binary data
  //   var bitmap;
  //   if (type == 'profile') {
  //     if (fs.existsSync(file) == true) {
  //       bitmap = fs.readFileSync(file);
  //     } else {
  //       bitmap = fs.readFileSync(
  //         join(process.cwd(), '/../upload_img/img_avatar.png'),
  //       );
  //     }
  //   } else if (type == 'headerfooter') {
  //     bitmap = fs.readFileSync(file);
  //   } else if (type == 'esig') {
  //     if (fs.existsSync(file) == true) {
  //       bitmap = fs.readFileSync(file);
  //     } else {
  //       return;
  //     }
  //   }

  //   // convert binary data to base64 encoded string
  //   return Buffer.from(bitmap).toString('base64');
  // }
  // getFirstDate(data: any) {
  //   let dump = JSON.parse(data);
  //   return dump[0];
  // }

  // isValidJSON(str: any) {
  //   try {
  //     JSON.parse(str);
  //   } catch (e) {
  //     return false;
  //   }
  //   return true;
  // }

  // formatDate(value) {
  //   return moment(value).format('MMM DD,YYYY');
  // }


  //IPCR Report Form
 
 
 

}
