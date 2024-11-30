import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  controllers: [SubjectsController],
  providers: [SubjectsService]
})
export class SubjectsModule {}
