import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDto } from './create-artist.dto';
import { diskStorage } from 'multer';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}
  @Get()
  get() {
    return this.artistModel.find();
  }
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.artistModel.findById({ _id: id });
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images/artists',
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
    @Body() artistDTO: CreateArtistDto,
  ) {
    const newArtist = new this.artistModel({
      name: artistDTO.name,
      description: artistDTO.description,
      image: file && file.filename ? '/images/artists/' + file.filename : null,
    });
    return await newArtist.save();
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const artist = await this.artistModel.findByIdAndDelete(id);
    if (!artist) {
      throw new NotFoundException('Artist not found!');
    }
    return { message: 'Artist has been deleted successfully!' };
  }
}
