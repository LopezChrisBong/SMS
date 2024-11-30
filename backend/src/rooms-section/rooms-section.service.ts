import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomsSectionDto } from './dto/create-rooms-section.dto';
import { UpdateRoomsSectionDto } from './dto/update-rooms-section.dto';
import { AddStrand, AddTracks, RoomsSection } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddTrackDto } from './dto/create-add-track.dto';
import { UpdateAddTrackDto } from './dto/update-add-track.dto';
import { CreateAddStrandDto } from './dto/create-add-strand.dto';
import { UpdateAddStrandDto } from './dto/update-add-strand.dto';

@Injectable()
export class RoomsSectionService {
  constructor(private dataSource: DataSource,
    @InjectRepository(RoomsSection)
    private readonly subjectRepository: Repository<RoomsSection>,
    @InjectRepository(AddTracks)
    private readonly addtrackRepository: Repository<AddTracks>,
  ){}


  async create(createRoomsSectionDto: CreateRoomsSectionDto) {

    console.log(createRoomsSectionDto)
      try {
        let data = this.dataSource.manager.create(RoomsSection,{
          room_section: createRoomsSectionDto.room_section,
          grade_level:createRoomsSectionDto.grade_level,
        })
        await this.dataSource.manager.save(data)
        return{
          msg:'Save successfully!', status:HttpStatus.CREATED
        }
      } catch (error) {
        return{
          msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
        }
      }
  
    }

    
  async addTrack(createAddTrackDto: CreateAddTrackDto) {

    console.log(createAddTrackDto)
      try {
        let data = this.dataSource.manager.create(AddTracks,{
          tracks_name: createAddTrackDto.tracks_name,
        })
        await this.dataSource.manager.save(data)
        return{
          msg:'Save successfully!', status:HttpStatus.CREATED
        }
      } catch (error) {
        return{
          msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
        }
      }
    }

    async addStrand(createAddStrandDto: CreateAddStrandDto) {

      console.log(createAddStrandDto)
        try {
          let data = this.dataSource.manager.create(AddStrand,{
            strand_name: createAddStrandDto.strand_name,
            trackId: createAddStrandDto.trackId,
          })
          await this.dataSource.manager.save(data)
          return{
            msg:'Save successfully!', status:HttpStatus.CREATED
          }
        } catch (error) {
          return{
            msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
          }
        }
      }


 async findAll(gradeLevel:string) {
    let data = await this.dataSource.manager
    .createQueryBuilder(RoomsSection, 'UD')
    .select([
      "*"
    ])
    .where('UD.grade_level = "'+gradeLevel+'"')
    .getRawMany();

    return data
  }

  async Alltracks() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const toReturn = await queryRunner.query(
      'SELECT * FROM add_tracks  order by tracks_name ASC',
    );
    await queryRunner.release();
    return toReturn;
  }

  async AllStrand() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const toReturn = await queryRunner.query(
      'SELECT * FROM add_strand left join add_tracks on add_strand.trackId = add_tracks.id  order by strand_name ASC',
    );
    await queryRunner.release();
    console.log(toReturn)
    return toReturn;
  }

  async AllStrandEnroll(id:number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const toReturn = await queryRunner.query(
      'SELECT * FROM add_strand where trackId = '+id+' order by strand_name ASC',
    );
    await queryRunner.release();
    console.log(toReturn)
    return toReturn;
  }


  findOne(id: number) {
    return `This action returns a #${id} roomsSection`;
  }

  update(id: number, updateRoomsSectionDto: UpdateRoomsSectionDto) {

    console.log(updateRoomsSectionDto)

try {
    this.dataSource.manager.update(RoomsSection,id,{
    room_section:updateRoomsSectionDto.room_section,
    grade_level: updateRoomsSectionDto.grade_level,
  })
  return{
    msg:'Updated successfully!', status:HttpStatus.CREATED
  }
} catch (error) {
  return{
    msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
  }
}
  }


  updateTrack(id: number, updateAddTrackDto: UpdateAddTrackDto) {

    console.log(updateAddTrackDto)

try {
    this.dataSource.manager.update(AddTracks,id,{
    tracks_name:updateAddTrackDto.tracks_name,
  })
  return{
    msg:'Updated successfully!', status:HttpStatus.CREATED
  }
} catch (error) {
  return{
    msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
  }
}
  }

  updateStrand(id: number, updateAddStrandDto: UpdateAddStrandDto) {

    console.log(updateAddStrandDto)

try {
    this.dataSource.manager.update(AddStrand,id,{
    strand_name:updateAddStrandDto.strand_name,
    trackId:updateAddStrandDto.trackId,
  })
  return{
    msg:'Updated successfully!', status:HttpStatus.CREATED
  }
} catch (error) {
  return{
    msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
  }
}
  }




    async remove(id: number) {
    try {
      await this.subjectRepository.delete(id);
      return {
        msg: 'Deleted successfully.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        msg: 'Deletion failed',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
