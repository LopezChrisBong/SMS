import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherSubject } from './entities/prefered-subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject,TeacherSubject])],
  controllers: [SubjectsController],
  providers: [SubjectsService]
})
export class SubjectsModule {}
