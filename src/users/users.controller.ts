import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
}
