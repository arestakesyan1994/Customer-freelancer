import { Feedback } from "src/feedback/entities/feedback.entity";
import { Job } from "src/jobs/entities/job.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId:number

    @ManyToOne(type => User, user =>user.customer, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    user: User

    
    @OneToMany(type => Job, job => job.customer)
    jobs: Job[]
    
    @OneToMany(type => Feedback, feedback => feedback.customer)
    feedback: Feedback[]
}
