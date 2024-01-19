import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(5)
  password?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  typedCurrentPassword: string;
}
