import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { Freelancer } from './entities/freelancer.entity';

@Injectable()
export class FreelancerService {
  constructor(
    @InjectRepository(Freelancer) private freelancerRepository: Repository<Freelancer>,
  ) { }

  async create(createFreelancerDto: CreateFreelancerDto) {
    await this.freelancerRepository.save(createFreelancerDto);
    return 'This action adds a new freelancer';
  }

  async findAll() {
    return this.freelancerRepository.find({
      relations:{
        user:true
      }
    });
  }

  async findOne(id: number) {
    return await this.freelancerRepository.findOne({
      where: {
        id
      },
      relations: {
        user:true
      }
    }) 
  }

  async findUserBySkillAndSalary({ skill, minsalary, maxsalary }: { skill: string, minsalary: number, maxsalary: number }) {
    if (!minsalary) { minsalary = 0 }
    if (!maxsalary) {
      const q = await this.freelancerRepository.find({
        order: {
          salary: "DESC",
        },
        take: 1
      })
      if (q.length) {
        maxsalary = q[0].salary
      }
    }
    let freelancer = undefined;
    if (skill && skill != ' ') {
      freelancer = await this.freelancerRepository
        .createQueryBuilder('freelancer')
        .where('freelancer.salary >= :minsalary', { minsalary })
        .andWhere('freelancer.salary <= :maxsalary', { maxsalary })
        .leftJoinAndSelect("freelancer.skills", "freelancer_skill")
        .leftJoinAndSelect("freelancer_skill.skill", "skill")
        .andWhere("skill.name = :skill", { skill })
        .getMany()
    } else {
      freelancer = await this.freelancerRepository
        .createQueryBuilder('freelancer')
        .where('freelancer.salary >= :minsalary', { minsalary })
        .andWhere('freelancer.salary <= :maxsalary', { maxsalary })
        .leftJoinAndSelect("freelancer.skills", "freelancer_skill")
        .leftJoinAndSelect("freelancer_skill.skill", "skill")
        .getMany()
    }

    if (!freelancer) {
      throw new UnauthorizedException("freelancer not fount")
    } else {
      return freelancer
    }
  }

  async update(id: number, updateFreelancerDto: UpdateFreelancerDto) {
    const us = await this.freelancerRepository.findOneBy({ id });
    if (us) {
      this.freelancerRepository.update({ id }, updateFreelancerDto)
      return "delete freelancer - " + us.id;
    } else {
      throw new NotFoundException('freelancer not found');
    }
  }

  async remove(id: number) {
    const us = await this.freelancerRepository.findOneBy({ id });
    if (us) {
      this.freelancerRepository.delete({ id })
      return "delete freelancer - " + us.id;
    } else {
      throw new NotFoundException('freelancer not found');
    }  }
}
