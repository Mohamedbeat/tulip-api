import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFollowDto {
  @IsNotEmpty()
  @IsString()
  // @IsUUID()
  followingId: string;
}
