import { Exclude } from 'class-transformer';
import { Follow } from 'src/follows/entities/follow.entity';
import { Post } from 'src/posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ default: true })
  isActivated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Follow, (follow) => follow.follower, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  followers: Follow[];

  @OneToMany(() => Post, (post) => post.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  posts: Post[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
