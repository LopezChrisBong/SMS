import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class TeacherGradeLevel {

    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column({ type: "varchar" })
    grade_level: string

    @Column({ type: "varchar" })
    teachersId: string

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
