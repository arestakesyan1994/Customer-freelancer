import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/jobs/entities/job.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { Repository } from 'typeorm';
import { CreateJobSkillDto } from './dto/create-job-skill.dto';
import { UpdateJobSkillDto } from './dto/update-job-skill.dto';
import { JobSkill } from './entities/job-skill.entity';

@Injectable()
export class JobSkillService {

  constructor(
    @InjectRepository(JobSkill) private jobSkillRepository: Repository<JobSkill>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,

  ) { }

  async create(createJobSkillDto: any) {
    const skill = await this.skillRepository.findOneBy({id:createJobSkillDto.skillId})
    if(!skill){
      throw new NotFoundException('skills not found');
    }
    const job = await this.jobRepository.findOneBy({id:createJobSkillDto.jobId})
    if(!job){
      throw new NotFoundException('job not found');
    }
    const userskill = await this.jobSkillRepository.find({
      where: {
        skillId: createJobSkillDto.skillId,
        jobId:createJobSkillDto.jobId
      },
    })
    if (userskill.length) {
      throw new NotFoundException('job skills has already');
    } else {
      await this.jobSkillRepository.save(createJobSkillDto)
      return 'adds a new job skill';
    }
  }

  async findSkillByJobId(id: number) {
    const jobSkill = await this.jobSkillRepository.find({
      where: {
        jobId: id
      },
      relations: ['skill']
    })
    if (jobSkill) {
      return jobSkill;
    } else {
      throw new NotFoundException('job skills not found');
    }
  }

  async remove(id: number) {
    const jskill = await this.jobSkillRepository.findOneBy({ id });
    if (jskill) {
      this.jobSkillRepository.delete({ id })
      return "delete job skill - " + jskill.id;
    } else {
      throw new NotFoundException('job skills not found');
    }
  }
}
