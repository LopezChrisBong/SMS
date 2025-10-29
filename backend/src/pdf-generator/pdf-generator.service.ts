import { HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
// import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
// import * as PDFDocument from 'pdfkit'
// import { PDFOptions, PDFService } from '@t00nday/nestjs-pdf';

import { DataSource } from 'typeorm';

import { SendNewEmailDto } from './dto/send-new-email.dto';
import {
  Availability,
  EnrollStudent,
  RoomsSection,
  SchoolYear,
  StudentList,
  Subject,
  UserDetail,
  Users,
} from 'src/entities';
import { join } from 'path';

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

hbs.registerHelper('formatTime', function (time) {
  if (!time) return '';
  
  // Example: convert "13:30:00" → "1:30 PM"
  const date = new Date(`1970-01-01T${time}Z`);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

hbs.registerHelper('formatTimeRange', function (range) {
  if (!range) return '';

  // Example input: "13:00 - 14:00"
  const [from, to] = range.split('-').map(t => t.trim());
  if (!from || !to) return range;

  function formatTime(t) {
    const [hour, minute] = t.split(':').map(Number);
    if (isNaN(hour) || isNaN(minute)) return t;

    // Create a local Date object for time formatting
    const d = new Date(0, 0, 0, hour, minute);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  return `${formatTime(from)} - ${formatTime(to)}`;
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

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

hbs.registerHelper('or', function () {
  const args = Array.prototype.slice.call(arguments, 0, -1); 
  return args.some(Boolean);
});

hbs.registerHelper('includes', function (str, substring) {
  if (!str) return false;
  return str.includes(substring);
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

hbs.registerHelper('plusOne', function (value) {
  return value + 1;
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

  async compile(templatename, data) {
    const filepath = path.join(
      __dirname,
      '../pdf-generator/templates',
      `${templatename}.hbs`,
    );

    const html = await fs.readFile(filepath, 'utf-8');
    return hbs.compile(html)(data);
  }

  base64_encode(file, type) {
    // read binary data
    var bitmap;
    if (type == 'profile') {
      if (fs.existsSync(file) == true) {
        bitmap = fs.readFileSync(file);
      } else {
        bitmap = fs.readFileSync(
          join(process.cwd(), '/../upload_img/img_avatar.png'),
        );
      }
    } else if (type == 'headerfooter') {
      bitmap = fs.readFileSync(file);
    } else if (type == 'esig') {
      if (fs.existsSync(file) == true) {
        bitmap = fs.readFileSync(file);
      } else {
        return;
      }
    }

    return Buffer.from(bitmap).toString('base64');
  }
  getFirstDate(data: any) {
    let dump = JSON.parse(data);
    return dump[0];
  }

  isValidJSON(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  formatDate(value) {
    return moment(value).format('MMM DD,YYYY');
  }



  async getMySchedule(facultyId: number, filter: number) {
    let mySched = await this.dataSource.manager
      .createQueryBuilder(Availability, 'A')
      .select([
        "A.id AS id",
        "CONCAT(A.times_slot_from, ' - ', A.times_slot_to) AS time",
        "MAX(CASE WHEN A.day = 'Monday' THEN CONCAT(sub.subject_title, '<br><span style=\"font-size:8px\">', room.room_section, '</span>') END) AS Monday",
        "MAX(CASE WHEN A.day = 'Tuesday' THEN CONCAT(sub.subject_title, '<br><span style=\"font-size:8px\">', room.room_section, '</span>') END) AS Tuesday",
        "MAX(CASE WHEN A.day = 'Wednesday' THEN CONCAT(sub.subject_title, '<br><span style=\"font-size:8px\">', room.room_section, '</span>') END) AS Wednesday",
        "MAX(CASE WHEN A.day = 'Thursday' THEN CONCAT(sub.subject_title, '<br><span style=\"font-size:8px\">', room.room_section, '</span>') END) AS Thursday",
        "MAX(CASE WHEN A.day = 'Friday' THEN CONCAT(sub.subject_title, '<br><span style=\"font-size:8px\">', room.room_section, '</span>') END) AS Friday",
        "MAX(CASE WHEN A.day = 'Saturday' THEN CONCAT(sub.subject_title, '<br><span style=\"font-size:8px\">', room.room_section, '</span>') END) AS Saturday"
      ])
      .leftJoin(RoomsSection, 'room', 'room.id = A.roomId')
      .leftJoin(Subject, 'sub', 'sub.id = A.subjectId')
      .where('A.teacherID = :facultyId', { facultyId })
      .andWhere('A.school_yearId = :filter', { filter })
      .groupBy('A.times_slot_from, A.times_slot_to, A.teacherID')
      .orderBy('A.times_slot_from')
      .getRawMany();

          const fixedBlocks = [
          {
            time: '7:15 - 7:30',
            Monday: 'CONVOCATION PROGRAM',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: null
          },
          {
            time: '9:30 - 10:00',
            Monday: 'RECESS - Handwashing Time',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: null
          },
          {
            time: '12:00 - 12:30',
            Monday: 'LUNCH BREAK',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: null
          },
          {
            time: '12:30 - 1:00',
            Monday: 'READING REMEDIATION',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: null
          }
        ];

        function timeToMinutes(timeString: string): number {
          const firstPart = timeString.split(/[–-]/)[0].trim();

          const match = firstPart.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
          if (!match) return 0;

          const [, hStr, mStr, periodRaw] = match;
          let h = parseInt(hStr, 10);
          let m = parseInt(mStr, 10);
          const period = periodRaw ? periodRaw.toUpperCase() : null;

          if (period === 'PM' && h < 12) h += 12;
          if (period === 'AM' && h === 12) h = 0;

          // 🩵 NEW LOGIC: if no AM/PM, assume PM for hours between 1–6 (like 1:00–6:00)
          if (!period && h >= 1 && h <= 6) {
            h += 12;
          }

          return h * 60 + m;
        }
        mySched = [...fixedBlocks, ...mySched].sort(
          (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
        );

        let teacherName =  await this.dataSource.manager
          .createQueryBuilder(UserDetail, 'UD')
          .select([ 
            'UD.*',
            "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ', SUBSTRING(UD.mname, 1, 1), ' ', UD.lname), concat(UD.fname, ' ', UD.lname)) as name",
          ])
          .where('UD.id = :facultyId', { facultyId })
          .getRawOne()
        // console.log('teacherName', mySched);

    let headerImg = join(process.cwd(), '/static/img/header.png');
    // let headerImg = join(process.cwd(), '/../static/img/header.png');
    let footerImg = join(process.cwd(), '/static/img/footer.png');
    // let footerImg = join(process.cwd(), '/../static/img/footer.png');


    const data = [
      {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        footer_img: this.base64_encode(footerImg, 'headerfooter'),
        mySched:mySched,
        year: filter,
        teacherName:teacherName
        // month:getmonth
      },
    ];

    // console.log(data);
    try {
      const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('my-sched', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
        // displayHeaderFooter: true,
        // footerTemplate:
        //   '<div style="border: 1px solid black; width:100%;z-index:1">  <div style=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=" style="width:30px;height:30px;"/></div><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      });
      // console.log('Applicant generated');
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async getAllUnderLoadFaculty(filter:number, status :number){
         let query = this.dataSource.manager
          .createQueryBuilder(UserDetail, 'UD')
          .select([
            "A.*",
            "A.id as id",
            "UD.education as education",
            "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ', SUBSTRING(UD.mname, 1, 1), ' ', UD.lname), concat(UD.fname, ' ', UD.lname)) as name",
           
          ])
          .leftJoin(Availability, 'A', 'A.teacherID = UD.id')
          .where('A.school_yearId = :filter', { filter })
          .andWhere('UD.status = :status', { status: status })
          let rawData = await query.getRawMany();
          // console.log(rawData)
          let load = []
          rawData.forEach(hours => {
            const obj = load.find(teacher=> teacher.teacherID === hours.teacherID)
            if(obj){
              obj.hours = Number(obj.hours) + Number(hours.hours)
            }else{
              load.push(hours)
            }
          })
          for (let i = 0; i < load.length; i++) {
            let loadedHour = Number(load[i].hours) - 40
            // let loadedHour = 40 - 40
            if(loadedHour > 0){
              Object.assign(load[i], {overload:loadedHour});
            }else{
              let data = loadedHour * (-1)
              Object.assign(load[i], {underload:data});
            }
          }
            // console.log(load)

            let newLoader = []
            for (let i = 0; i < load.length; i++) {
              if( load[i].underload != -0){
                newLoader.push(load[i])
              }
            }
            // console.log(newLoader)

        let headerImg = join(process.cwd(), '/static/img/header.png');
        let footerImg = join(process.cwd(), '/static/img/footer.png');
        
        // let headerImg = join(process.cwd(), '/../static/img/header.png');
        // let footerImg = join(process.cwd(), '/../static/img/footer.png');
        const data = [
        {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        footer_img: this.base64_encode(footerImg, 'headerfooter'),
        load:newLoader
        // name:gradeLevel == 'Grade 11' || gradeLevel == 'Grade 12'? arr[0].name: arr.name,
        },
    ];
    try {
      const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('underload-faculty', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
        // displayHeaderFooter: true,
        // footerTemplate:
        //   '<div style="border: 1px solid black; width:100%;z-index:1">  <div style=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=" style="width:30px;height:30px;"/></div><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      });
      // console.log('Applicant generated');
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async getClassProgramm(filter:number, status :number, grade_level:string, roomID:number){
    // console.log(filter, status, grade_level, roomID)
         let roomData = await this.dataSource.manager
          .createQueryBuilder(RoomsSection,'rs')
          .select([
            'rs.*',
            "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ', SUBSTRING(UD.mname, 1, 1), ' ', UD.lname), concat(UD.fname, ' ', UD.lname)) as name",
          ])
          .leftJoin(UserDetail,'ud','rs.teacherId = ud.id')
          .where('rs.id = :roomID', { roomID })
          .getRawOne()

          let schoolYear = await this.dataSource.manager
          .createQueryBuilder(SchoolYear,'sy')
          .where('sy.id = '+filter)
          .getRawOne()
        // console.log(schoolYear)

         let query = this.dataSource.manager
          .createQueryBuilder(RoomsSection, 'RS')
          .select([
            "A.*",
            "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ', SUBSTRING(UD.mname, 1, 1), ' ', UD.lname), concat(UD.fname, ' ', UD.lname)) as name",
            "S.subject_title as subject_title",
          ])
          .leftJoin(Availability, 'A', 'A.roomId = RS.id')
          .leftJoin(UserDetail, 'UD', 'UD.id = A.teacherID')
          .leftJoin(Subject, 'S', 'S.id = A.subjectId')
          .where('A.school_yearId = :filter', { filter })
          .andWhere('UD.status = :status', { status: status })
          .andWhere('A.grade_level = :grade_level', { grade_level: grade_level })
          .andWhere('A.roomID = :roomID', { roomID: roomID })
          let rawData = await query.getRawMany();
          // console.log(rawData) 
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          const uniqueTimes = [
            ...new Set(
              rawData.map(
                (item) => `${item.times_slot_from} - ${item.times_slot_to}`
              )
            ),
          ];

          const formatted = uniqueTimes.map((time) => {
            const [from, to] = time.split(' - ');
            const row: any = { time };

            days.forEach((day) => {
              const match = rawData.find(
                (r) =>
                  r.day === day &&
                  r.times_slot_from === from &&
                  r.times_slot_to === to
              );

              row[day] = match ? `${match.subject_title}<br><span style='font-size:10px'>${match.name}</span>` : '';
            });

            return row;
          });
          // console.log(formatted)
        const breaks = [
      {
        time: '07:15 - 07:30',
        Monday: '',
        Tuesday: '',
        Wednesday: 'Flag Ceremony',
        Thursday: '',
        Friday: '',
      },
      {
        time: '09:30 - 09:35',
        Monday: '',
        Tuesday: '',
        Wednesday: 'Handwashing Time',
        Thursday: '',
        Friday: '',
      },
      {
        time: '09:35 - 09:50',
        Monday: '',
        Tuesday: '',
        Wednesday: 'Recess',
        Thursday: '',
        Friday: '',
      },
      {
        time: '09:50 - 10:00',
        Monday: '',
        Tuesday: '',
        Wednesday: 'Reading Remediation',
        Thursday: '',
        Friday: '',
      },
      {
        time: '12:00 - 12:30',
        Monday: '',
        Tuesday: '',
        Wednesday: 'Lunch',
        Thursday: '',
        Friday: '',
      },
      {
        time: '12:30 - 01:00',
        Monday: '',
        Tuesday: '',
        Wednesday: 'Essential Services',
        Thursday: '',
        Friday: '',
      },
    ];

    // Merge and sort properly using actual time values
    const fullSchedule = [...breaks, ...formatted].sort(
      (a, b) => this.getMinutes(a.time) - this.getMinutes(b.time),
    );

        
          let newSchedule = this.sortSchedule(fullSchedule)
          console.log(newSchedule)

        let headerImg = join(process.cwd(), '/static/img/header.png');
        let footerImg = join(process.cwd(), '/static/img/footer.png');
        
        // let headerImg = join(process.cwd(), '/../static/img/header.png');
        // let footerImg = join(process.cwd(), '/../static/img/footer.png');
        const data = [
        {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        footer_img: this.base64_encode(footerImg, 'headerfooter'),
        mySched:newSchedule,
        schoolYear,
        roomData,
        grade_level
        // name:gradeLevel == 'Grade 11' || gradeLevel == 'Grade 12'? arr[0].name: arr.name,
        },
    ];
    try {
      const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('classroom-programm', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.30in',
          bottom: '0.20in',
          right: '0.30in',
        },
        landscape: false,
        printBackground: true,
        // displayHeaderFooter: true,
        // footerTemplate:
        //   '<div style="border: 1px solid black; width:100%;z-index:1">  <div style=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=" style="width:30px;height:30px;"/></div><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      });
      // console.log('Applicant generated');
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  private getMinutes(timeRange: string): number {
    const start = timeRange.split('-')[0].trim();
    const [hour, minute] = start.split(':').map(Number);
    let totalMinutes = hour * 60 + minute;
    if (timeRange.toLowerCase().includes('pm') && hour < 12) {
      totalMinutes += 12 * 60;
    }
    return totalMinutes;
  }

 sortSchedule(schedule: any[]) {
  return schedule.sort((a, b) => {
    const timeA = this.convertTo24Hour(a.time.split(' - ')[0]);
    const timeB = this.convertTo24Hour(b.time.split(' - ')[0]);
    return timeA - timeB;
  });
}

convertTo24Hour(time: string): number {
  // Example input: "01:00", "07:15"
  const [hours, minutes] = time.split(':').map(Number);

  // Detect AM/PM manually
  let h = hours;
  if (time.toLowerCase().includes('pm') && h !== 12) h += 12;
  if (time.toLowerCase().includes('am') && h === 12) h = 0;

  // Treat times before 7:00 as PM if your schedule starts early (like 7:15 AM)
  if (h < 7) h += 12; 

  return h * 60 + minutes; // Convert to minutes for easy comparison
}
 

  async getQRCode(id: string) {
    let d = await QRCode.toDataURL(id)
      .then((url) => {
        return url;
      })
      .catch((err) => {
        console.error(err);
      });
    let qrdata = {
      url: d,
    };

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const content = await this.compile('qrcode', qrdata);

      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'letter',
        margin: {
          top: '0.25in',
          left: '0.25in',
          bottom: '0.25in',
          right: '0.25in',
        },
        landscape: false,
        printBackground: true,
      });
      console.log('done');
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }
 
  async getSchoolForm2(school_yearID:number, roomID:number,subjectID:number, attendanceDate:string, teacherID:number){
    // console.log(filter,roomID,subjectID,date)
    let attendance;
    let rawData;
    let month ;
     if(attendanceDate == '1'){
      month = 'January'
    }
    else if( attendanceDate == '2'){
      month = 'February'
    }
    else if( attendanceDate == '3'){
      month = 'March'
    }
    else if( attendanceDate == '4'){
      month = 'April'
    }
    else if( attendanceDate == '5'){
      month = 'May'
    }
    else if( attendanceDate == '6'){
      month = 'June'
    }
    else if( attendanceDate == '7'){
      month = 'July'
    }
    else if( attendanceDate == '8'){
      month = 'August'
    }
    else if( attendanceDate == '9'){
      month = 'September'
    }
    else if( attendanceDate == '10'){
      month = 'October'
    }
    else if( attendanceDate == '11'){
      month = 'November'
    }
    else if( attendanceDate == '12'){
      month = 'December'
    }
    let teacherData = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname)  AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,' ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'RS.room_section as room_section',
        'RS.grade_level as grade_level'
      ])
      .leftJoin(RoomsSection, 'RS', 'RS.teacherID = UD.id')
      .where('UD.id = :teacherID', { teacherID })
      .andWhere('RS.id = :roomID', { roomID })
      .getRawOne();

     let schoolYear = await this.dataSource.manager
          .createQueryBuilder(SchoolYear, 'SY')
          .select([
            // "*",
            "CONCAT(school_year_from, ' - ', school_year_to) AS school_year",
          "CONCAT(school_year_from, '-06-01') as startDate,CONCAT(school_year_to, '-05-31') as endDate"
          ])
          .where('SY.id = :school_yearID', { school_yearID })
          .getRawOne();

          
        const dates = await this.dataSource.query(
        `
        SELECT DISTINCT attendanceDate
        FROM student_attendance
        WHERE roomID = ? AND subjectID = ? AND school_yearID = ?
        ORDER BY attendanceDate
        `,
        [roomID, subjectID, school_yearID]
      );
       
      if (!dates.length) {
      attendance = false
      }else{
      attendance = true
        const dateColumns = dates
        .map(
          (d) =>
            `COALESCE(MAX(CASE WHEN a.attendanceDate = '${d.attendanceDate}' THEN a.attendance END), 0) AS \`${d.attendanceDate}\``
        )
        .join(', ');
     
          const sql = `
          SELECT 
            CONCAT(s.lname, ' ', s.fname) AS student_name,
            ${dateColumns}
          FROM student_attendance a
          JOIN enroll_student s ON a.studentID = s.id
          WHERE a.roomID = ? AND a.subjectID = ? AND a.school_yearID = ? AND MONTH(a.attendanceDate) = ?  AND s.statusEnrolled = 1
          GROUP BY s.id, s.fname, s.lname
          ORDER BY student_name
        `;

         rawData =  await this.dataSource.query(sql, [roomID, subjectID, school_yearID, attendanceDate])
         }
           
            console.log('rawData',roomID, subjectID, school_yearID, attendanceDate);

        let newData
        let updatedRow
         if(attendance === true){
          newData = await this.transformSchoolForm2(rawData,month)
          updatedRow = newData.rows.map((row) => {
          return row.map((val, idx) => {
            // First column is student_name, last two are absent/tardy counters → keep them as-is
            if (idx === 0 || idx >= row.length - 2) return val;
            if (val === "0") return "✖";       
            if (val === "3") return "▨";       
            if (val === "2") return "◻";       
            if (val) return "✔";               
            return "";                          
          });
        });
        
         }



        let headerImg = join(process.cwd(), '/static/img/header.png');
        let footerImg = join(process.cwd(), '/static/img/footer.png');
        
        // let headerImg = join(process.cwd(), '/../static/img/header.png');
        // let footerImg = join(process.cwd(), '/../static/img/footer.png');
        const data = [
        {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        // footer_img: this.base64_encode(footerImg, 'headerfooter'),
        schoolYear:schoolYear,
        teacherData:teacherData,
        rawData:newData,
        updatedRow:updatedRow,
        month:month
  
        },
    ];
    try {
      const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('school-form2', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: true,
        printBackground: true,
      });
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
}
 
async transformSchoolForm2(data: any[], selectedMonth: string) {
  const allDates = [...new Set(
    data.flatMap(d => Object.keys(d).filter(k => k !== "student_name"))
  )].sort();

  const months: Record<string, number[]> = {};
  allDates.forEach(dateStr => {
    const date = new Date(dateStr);
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const month = date.getMonth();

    if (monthName === selectedMonth) {
      const totalDays = new Date(year, month + 1, 0).getDate();

      if (!months[monthName]) {
        months[monthName] = Array.from({ length: totalDays }, (_, i) => i + 1);
      }
    }
  });

  const headers = [
    { type: "fixed", label: "Learner's Name" },
    ...Object.entries(months).map(([month, days]) => ({
      type: "month",
      month: "1st row for date of " + month,
      days
    })),
    { type: "fixed", label: "Absent" },
    { type: "fixed", label: "Present" }
  ];

  const rows = data.map(d => {
    const row: (string | number)[] = [d.student_name];
    let absent = 0, present = 0;

    Object.entries(months).forEach(([month, days]) => {
      days.forEach(day => {
        const year = new Date(allDates[0]).getFullYear(); // take year from dataset
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const val = d[dateStr] ?? "";
        row.push(val);

        if (val === "0") absent++;
        if (val === "1") present++;
      });
    });

    // row.push(absent, tardy);
    row.push(absent,present);
    return row;
  });

  return { headers, rows };
}

  async getAllStudenList(filter:number, id:number, grade:string){
    let rawData_male = await this.dataSource.manager
      .createQueryBuilder(StudentList, 'SL')
      .select([
        "*",
        "SL.id as studentListId",
       "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.lname, ' ',SUBSTRING(ES.mname, 1, 1) ,' ',ES.fname) ,concat(ES.lname, ' ', ES.fname)) as name",  
        "IF (!ISNULL(ES.guardian_mname)  AND LOWER(ES.guardian_mname) != 'n/a', concat(ES.guardian_fname, ' ',SUBSTRING(ES.guardian_mname, 1, 1) ,' ',ES.guardian_lname) ,concat(ES.guardian_fname, ' ', ES.guardian_lname)) as guardian_name", 
            ])
      .leftJoin(RoomsSection, 'room', 'room.id = SL.roomId')
      .leftJoin(EnrollStudent, 'ES', 'ES.id = SL.studentId')
      .where('SL.school_yearId = "'+filter+'"')
      .andWhere('ES.sex = "Male"')
      .andWhere('SL.grade_level = "'+grade+'"')
      .andWhere('SL.roomId = "'+id+'"')
      .andWhere('ES.statusEnrolled = 1')
      .orderBy('ES.lname')
      .getRawMany();
    let count_male = await this.dataSource.manager
      .createQueryBuilder(StudentList, 'SL')
      .select([
        "*",
        "SL.id as studentListId",
       "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.lname, ' ',SUBSTRING(ES.mname, 1, 1) ,' ',ES.fname) ,concat(ES.lname, ' ', ES.fname)) as name", 
        "IF (!ISNULL(ES.guardian_mname)  AND LOWER(ES.guardian_mname) != 'n/a', concat(ES.guardian_fname, ' ',SUBSTRING(ES.guardian_mname, 1, 1) ,' ',ES.guardian_lname) ,concat(ES.guardian_fname, ' ', ES.guardian_lname)) as guardian_name", 
            ])
      .leftJoin(RoomsSection, 'room', 'room.id = SL.roomId')
      .leftJoin(EnrollStudent, 'ES', 'ES.id = SL.studentId')
      .where('SL.school_yearId = "'+filter+'"')
      .andWhere('ES.sex = "Male"')
      .andWhere('SL.grade_level = "'+grade+'"')
      .andWhere('SL.roomId = "'+id+'"')
      .andWhere('ES.statusEnrolled = 1')
      .orderBy('ES.lname')
      .getCount();

       let rawData_female = await this.dataSource.manager
      .createQueryBuilder(StudentList, 'SL')
      .select([
        "*",
        "SL.id as studentListId",
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.lname, ' ',SUBSTRING(ES.mname, 1, 1) ,' ',ES.fname) ,concat(ES.lname, ' ', ES.fname)) as name", 
        "IF (!ISNULL(ES.guardian_mname)  AND LOWER(ES.guardian_mname) != 'n/a', concat(ES.guardian_fname, ' ',SUBSTRING(ES.guardian_mname, 1, 1) ,' ',ES.guardian_lname) ,concat(ES.guardian_fname, ' ', ES.guardian_lname)) as guardian_name", 
            ])
      .leftJoin(RoomsSection, 'room', 'room.id = SL.roomId')
      .leftJoin(EnrollStudent, 'ES', 'ES.id = SL.studentId')
      .where('SL.school_yearId = "'+filter+'"')
      .andWhere('ES.sex = "Female"')
      .andWhere('SL.grade_level = "'+grade+'"')
      .andWhere('SL.roomId = "'+id+'"')
      .andWhere('ES.statusEnrolled = 1')
      .orderBy('ES.lname')
      .getRawMany();

      let count_female = await this.dataSource.manager
      .createQueryBuilder(StudentList, 'SL')
      .select([
        "*",
        "SL.id as studentListId",
        "IF (!ISNULL(ES.mname)  AND LOWER(ES.mname) != 'n/a', concat(ES.lname, ' ',SUBSTRING(ES.mname, 1, 1) ,' ',ES.fname) ,concat(ES.lname, ' ', ES.fname)) as name", 
        "IF (!ISNULL(ES.guardian_mname)  AND LOWER(ES.guardian_mname) != 'n/a', concat(ES.guardian_fname, ' ',SUBSTRING(ES.guardian_mname, 1, 1) ,' ',ES.guardian_lname) ,concat(ES.guardian_fname, ' ', ES.guardian_lname)) as guardian_name", 
            ])
      .leftJoin(RoomsSection, 'room', 'room.id = SL.roomId')
      .leftJoin(EnrollStudent, 'ES', 'ES.id = SL.studentId')
      .where('SL.school_yearId = "'+filter+'"')
      .andWhere('ES.sex = "Female"')
      .andWhere('SL.grade_level = "'+grade+'"')
      .andWhere('SL.roomId = "'+id+'"')
      .andWhere('ES.statusEnrolled = 1')
      .orderBy('ES.lname')
      .getCount();

        let headerImg = join(process.cwd(), '/static/img/header.png');
        let footerImg = join(process.cwd(), '/static/img/footer.png');
        
        // let headerImg = join(process.cwd(), '/../static/img/header.png');
        // let footerImg = join(process.cwd(), '/../static/img/footer.png');
        const data = [
        {
        header_img: this.base64_encode(headerImg, 'headerfooter'),
        footer_img: this.base64_encode(footerImg, 'headerfooter'),
        rawData_male:rawData_male ? rawData_male:[],
        rawData_female:rawData_female ? rawData_female:[],
        count_male,
        count_female,
        total_student:count_female+ count_male
        },
    ];
    try {
      const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('student-list', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'legal',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
        });
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
}
}
