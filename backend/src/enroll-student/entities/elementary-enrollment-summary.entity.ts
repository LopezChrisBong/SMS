import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ElementaryEnrollmentSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  school_year_id: number;

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
