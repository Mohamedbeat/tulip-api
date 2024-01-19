import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFollowDto {
  @IsNotEmpty()
  @IsString()
  followingUserId: string;

  @IsNotEmpty()
  @IsString()
  followedUserId: string;
}
