import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { CreateTrackDto } from './create-track.dto';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}
  @Get()
  get(@Query('album') album: string) {
    if (album) {
      if (!album) {
        throw new NotFoundException('Album not found!');
      }
      return this.trackModel.find({ album });
    }
    return this.trackModel.find();
  }
  @UseGuards(TokenAuthGuard)
  @Post()
  async create(@Body() trackDTO: CreateTrackDto) {
    const album = await this.albumModel.findById(trackDTO.album);
    if (!album) {
      throw new NotFoundException('Album not found!');
    }
    const newTrack = new this.trackModel({
      album,
      title: trackDTO.title,
      trackDuration: trackDTO.trackDuration,
    });
    return await newTrack.save();
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const track = await this.trackModel.findByIdAndDelete(id);
    if (!track) {
      throw new NotFoundException('Track not found!');
    }
    return { message: 'Track has been deleted successfully!' };
  }
}
