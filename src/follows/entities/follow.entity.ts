import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Follow {
  @PrimaryColumn('uuid')
  followingUserId: string;
  @PrimaryColumn('uuid')
  followedUserId: string;
}
