import { Customer } from 'src/customer/entities/customer.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Freelancer } from 'src/freelancer/entities/freelancer.entity';
import { JobSkill } from 'src/job-skill/entities/job-skill.entity';
import { JobUser } from 'src/job-user/entities/job-user.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { StatusEnum } from '../status/status.enum';



@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    price: number

    @Column("int")
    customerId: number

    @Column({nullable:true, select: false})
    freelancerId: number

    @Column({ default: 0 })
    status: StatusEnum
    
    @Column({default: 0 })
    rate: number

    @Column()
    text: string

    @ManyToOne(type => Customer, customer =>customer.jobs, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    customer: Customer

    @ManyToOne(type => Freelancer, freelancer =>freelancer.jobs)
    freelancer: Freelancer

    @OneToMany(type => JobSkill, job => job.job)
    jobSkills: JobSkill[]
    
    @OneToMany(type => JobUser, job => job.job)
    jobUsers: JobUser[]
    
    @OneToMany(type => Feedback, feed => feed.job)
    feedback: Feedback
}
