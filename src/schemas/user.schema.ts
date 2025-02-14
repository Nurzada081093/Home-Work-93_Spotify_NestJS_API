import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  token: string;
  displayName?: string;
  generateToken: () => void;
  checkPassword: (password: string) => Promise<boolean>;
}

const HASHING_PASSWORD = 10;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  token: string;
  @Prop()
  displayName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function (this: UserDocument) {
  this.token = randomUUID();
};

UserSchema.methods.checkPassword = function (
  this: UserDocument,
  password: string,
) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) return;

  const hashingPassword = await bcrypt.genSalt(HASHING_PASSWORD);
  this.password = await bcrypt.hash(this.password, hashingPassword);
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});
