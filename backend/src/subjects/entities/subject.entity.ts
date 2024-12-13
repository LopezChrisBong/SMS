import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Subject {

    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column({ type: "varchar" })
    subject_title: string


    @Column({ type: "int"})
    status: number

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
