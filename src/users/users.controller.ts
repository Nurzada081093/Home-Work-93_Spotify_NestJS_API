import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  @Post()
  register(@Body() userDTO: CreateUserDto) {
    const newUser: UserDocument = new this.userModel({
      email: userDTO.email,
      password: userDTO.password,
      displayName: userDTO.displayName,
    });
    newUser.generateToken();
    return newUser.save();
  }
  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  login(@Req() req: Request<{ user: User }>) {
    return req.user;
  }
  @Delete('sessions')
  async logout(@Req() req: Request) {
    const token: string | undefined = req.get('Authorization');
    if (!token) {
      throw new UnauthorizedException('No token provided!');
    }
    const user = await this.userModel.findOne({ token: token });
    if (!user) {
      throw new UnauthorizedException('Invalid token!');
    }
    user.generateToken();
    await user.save();
    return { message: `${user.email} has been successfully logout!` };
  }
}
