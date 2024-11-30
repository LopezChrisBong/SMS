import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Subject {

    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column({ type: "varchar" })
    subject_title: string

    @Column({ type: "varchar" })
    seniorJunior: string

    @Column({ type: "varchar" })
    grade_level: string

    @Column({ type: 'varchar', default: null, nullable: true })
    date_from: string;

    @Column({ type: 'varchar', default: null, nullable: true })
    date_to: string;

    @Column({ type: 'varchar', length: 4, nullable: true })
    posted_year: string;

    @CreateDateColumn({
      nullable: false,
      type: 'datetime',
      name: 'created_at',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;
  
    @UpdateDateColumn({
      default: () => 'CURRENT_TIMESTAMP(6)',
      name: 'updated_at',
      type: 'datetime',
    })
    updatedAt: Date;


}