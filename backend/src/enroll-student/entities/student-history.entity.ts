import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class StudentEnrollmentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

  @Column({ nullable: true })
  school_yearId: number;

  @Column({ length: 50, nullable: true })
  LRN: string;

  @Column({ length: 50, nullable: true })
  grade_level: string;

  @Column()
  statusEnrolled: number;

  @CreateDateColumn()
  created_at: Date;
}
