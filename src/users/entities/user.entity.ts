import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { RoleEntity } from 'src/roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class UserEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'test1@example.com' })
  @Column({ unique: true })
  @Expose({ groups: ['admin'] })
  email: string;

  @ApiProperty({
    example:
      '	$argon2id$v=19$m=65536,t=3,p=4$34LSS8ksUiFSdx2ayAvaIg$MB0j+1covlcrPJ6a7QQqzU7cIOybRTirT0dgdNW1LsE',
  })
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ example: 'Jack' })
  @Index()
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Jack' })
  @Index()
  @Column()
  lastName: string;

  @ApiProperty({ type: RoleEntity })
  @OneToOne(() => RoleEntity, { eager: true })
  @JoinColumn()
  role: RoleEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
