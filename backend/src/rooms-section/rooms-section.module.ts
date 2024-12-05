import { Module } from '@nestjs/common';
import { RoomsSectionService } from './rooms-section.service';
import { RoomsSectionController } from './rooms-section.controller';
import { AddStrand, AddTracks, Availability, RoomsSection, StudentList } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoomsSection, AddTracks,AddStrand, StudentList,Availability])],
  controllers: [RoomsSectionController],
  providers: [RoomsSectionService]
})
export class RoomsSectionModule {}
