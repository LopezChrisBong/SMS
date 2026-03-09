import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class CallbackElementaryEnrollmentSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  school_year_from: string;

  @Column()
  school_year_to: string;

  @Column()
  grade_level: string;

  @Column({ default: 0 })
  male_count: number;

  @Column({ default: 0 })
  female_count: number;

  @Column({ default: 0 })
  total_count: number;

  @CreateDateColumn()
  created_at: Date;
}
