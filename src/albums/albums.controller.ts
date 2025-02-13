import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';
import { diskStorage } from 'multer';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}
  @Get()
  get(@Query('artist') artist: string) {
    if (artist) {
      if (!artist) {
        throw new NotFoundException('Artist not found!');
      }
      return this.albumModel.find({ artist });
    }
    return this.albumModel.find();
  }
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.albumModel.findById({ _id: id });
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images/albums',
        filename: (_req, file, callback) => {
          const imageFormat = file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/);
          const format = imageFormat ? imageFormat[1] : 'jpg';
          callback(null, `${crypto.randomUUID()}.${format}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumDTO: CreateAlbumDto,
  ) {
    const artist = await this.artistModel.findById(albumDTO.artist);
    if (!artist) {
      throw new NotFoundException('Artist not found!');
    }
    const newAlbum = new this.albumModel({
      artist,
      title: albumDTO.title,
      releaseDate: albumDTO.releaseDate,
      image: file && file.filename ? '/images/albums/' + file.filename : null,
    });
    return await newAlbum.save();
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const album = await this.albumModel.findByIdAndDelete(id);
    if (!album) {
      throw new NotFoundException('Album not found!');
    }
    return { message: 'Album has been deleted successfully!' };
  }
}
