import { Customer } from 'src/customer/entities/customer.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    customerId: number

    @Column("int")
    jobId: number

    @Column({default: 0 })
    rate: number

    @Column()
    text: string

    @ManyToOne(type => Job, job => job.feedback, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    job: Job

    @ManyToOne(type => Customer, customer => customer.feedback, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    customer: Customer


}