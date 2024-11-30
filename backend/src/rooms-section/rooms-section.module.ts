import { Module } from '@nestjs/common';
import { RoomsSectionService } from './rooms-section.service';
import { RoomsSectionController } from './rooms-section.controller';
import { AddTracks, RoomsSection } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoomsSection, AddTracks])],
  controllers: [RoomsSectionController],
  providers: [RoomsSectionService]
})
export class RoomsSectionModule {}
