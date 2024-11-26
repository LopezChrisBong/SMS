import { join } from 'path';

export class Helper {
  static customFileName(req, file, cb) {
    let customFile = file.originalname.split('.')[0];
    customFile =
      customFile + Date.now() + '-' + Math.round(Math.random() * 1e9);
    let fileExtension = '';

    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = '.jpeg';
    } else if (file.mimetype.indexOf('jpg') > -1) {
      fileExtension = '.jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtension = '.png';
    } else if (file.mimetype.indexOf('pdf') > -1) {
      fileExtension = '.pdf';
    }

    customFile = customFile + fileExtension;
    cb(null, customFile);
  }

  static filePath(req, file, cb) {
    cb(null, join(process.cwd(), '/../upload_img/'));
  }

  static TO_filePath(req, file, cb) {
    cb(null, join(process.cwd(), '/../uploaded_attachments/'));
  }

  static tar_filepath(req, file, cb) {
    cb(null, join(process.cwd(), '/../uploaded_attachments/'));
  }

  static leave_filePath(req, file, cb) {
    // cb(null, join(process.cwd(), '/uploaded_leave_attachment/'));
    cb(null, join(process.cwd(), '/../uploaded_leave_attachment/'));
  }
  static upload_application_eligibility(req, file, cb) {
    // cb(null, join(process.cwd(), '/uploaded_leave_attachment/'));
    cb(null, join(process.cwd(), '/../upload_application_eligibility/'));
  }

  static upload_application_employment(req, file, cb) {
    // cb(null, join(process.cwd(), '/uploaded_leave_attachment/'));
    cb(null, join(process.cwd(), '/../upload_application_employment/'));
  }

  static upload_application_letter(req, file, cb) {
    // cb(null, join(process.cwd(), '/uploaded_leave_attachment/'));
    cb(null, join(process.cwd(), '/../upload_application_letter/'));
  }

  static upload_application_pds(req, file, cb) {
    // cb(null, join(process.cwd(), '/uploaded_leave_attachment/'));
    cb(null, join(process.cwd(), '/../upload_application_pds/'));
  }
  static upload_application_performance(req, file, cb) {
    // cb(null, join(process.cwd(), '/uploaded_leave_attachment/'));
    cb(null, join(process.cwd(), '/../upload_application_performance/'));
  }
  static upload_application_seminar(req, file, cb) {
    // cb(null, join(process.cwd(), '/uploaded_leave_attachment/'));
    cb(null, join(process.cwd(), '/../upload_application_seminar/'));
  }

  static upload_application_tor(req, file, cb) {
    // cb(null, join(process.cwd(), '/uploaded_leave_attachment/'));
    cb(null, join(process.cwd(), '/../upload_application_tor/'));
  }

  static multiple_file_upload(req, file, cb) {
    // cb(null, join(process.cwd(), '/uploaded_leave_attachment/'));
    cb(null, join(process.cwd(), '/../upload_application_tor/'));
  }

  static esign_filepath(req, file, cb) {
    cb(null, join(process.cwd(), '/../uploadedEsigImg/'));
  }
}
