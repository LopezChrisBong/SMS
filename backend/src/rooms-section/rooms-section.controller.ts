import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomsSectionService } from './rooms-section.service';
import { CreateRoomsSectionDto } from './dto/create-rooms-section.dto';
import { UpdateRoomsSectionDto } from './dto/update-rooms-section.dto';
import { CreateAddTrackDto } from './dto/create-add-track.dto';
import { UpdateAddTrackDto } from './dto/update-add-track.dto';
import { CreateAddStrandDto } from './dto/create-add-strand.dto';
import { UpdateAddStrandDto } from './dto/update-add-strand.dto';

@Controller('rooms-section')
export class RoomsSectionController {
  constructor(private readonly roomsSectionService: RoomsSectionService) {}

  @Post()
  create(@Body() createRoomsSectionDto: CreateRoomsSectionDto) {
    return this.roomsSectionService.create(createRoomsSectionDto);
  }

  @Post('addTrack')
  addTrack(@Body() createAddTrackDto: CreateAddTrackDto) {
    return this.roomsSectionService.addTrack(createAddTrackDto);
  }

  @Post('addStrand')
  addStrand(@Body() createAddStrandDto: CreateAddStrandDto) {
    return this.roomsSectionService.addStrand(createAddStrandDto);
  }


  
  @Get(':gradeLevel')
  findAll(@Param('gradeLevel') gradeLevel: string) {
    return this.roomsSectionService.findAll(gradeLevel);
  }

  
  @Get('Alltracks/Data')
  Alltracks() {
    return this.roomsSectionService.Alltracks();
  }

  @Get('AllStrand/Data')
  AllStrand() {
    return this.roomsSectionService.AllStrand();
  }

  @Get('AllStrand/Enroll/:id')
  AllStrandEnroll(@Param('id') id: string) {
    return this.roomsSectionService.AllStrandEnroll(+id);
  }
 
 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsSectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomsSectionDto: UpdateRoomsSectionDto) {
    return this.roomsSectionService.update(+id, updateRoomsSectionDto);
  }

  @Patch('updateTrack/:id')
  updateTrack(@Param('id') id: string, @Body() updateAddTrackDto: UpdateAddTrackDto) {
    return this.roomsSectionService.updateTrack(+id, updateAddTrackDto);
  }

  @Patch('updateStrand/:id')
  updateStrand(@Param('id') id: string, @Body() updateAddStrandDto: UpdateAddStrandDto) {
    return this.roomsSectionService.updateStrand(+id, updateAddStrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsSectionService.remove(+id);
  }
}
