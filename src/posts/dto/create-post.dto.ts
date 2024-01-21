import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  desc: string;
}
