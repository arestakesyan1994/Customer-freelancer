import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserSkillDto } from './dto/create-user-skill.dto';
import { UpdateUserSkillDto } from './dto/update-user-skill.dto';
import { UserSkill } from './entities/user-skill.entity';

@Injectable()
export class UserSkillsService {
  constructor(
    @InjectRepository(UserSkill) private userSkillRepository: Repository<UserSkill>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
    @InjectRepository(User) private userRepository: Repository<User>,

  ) { }

  async create(createUserSkillDto: any) {
    const skill = await this.skillRepository.findOneBy({ id: createUserSkillDto.skillId })
    if (!skill) {
      throw new NotFoundException('skills not found');
    }
    const user = await this.userRepository.findOneBy({ id: createUserSkillDto.userId })
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.role != 2) {
      throw new NotFoundException('you do not have access');
    }
    const userskill = await this.userSkillRepository.find({
      where: {
        skillId: createUserSkillDto.skillId,
        freelancerId: createUserSkillDto.userId
      },
    })
    if (userskill.length) {
      throw new NotFoundException('user skills has already');
    }
    await this.userSkillRepository.save(createUserSkillDto)
    return 'adds a new user skill';

  }

  async findSkillByFreelacerId(id: number) {
    const userskill = await this.userSkillRepository.find({
      where: {
        freelancerId: id
      },
      relations: ['skill']
    })
    if (userskill) {
      return userskill;
    } else {
      throw new NotFoundException('user skills not found');
    }
  }

  async remove(id: number) {
    const skill = await this.userSkillRepository.findOneBy({ id });
    if (skill) {
      this.userSkillRepository.delete({ id })
      return "delete user skill - " + skill.id;
    } else {
      throw new NotFoundException('user skills not found');
    }
  }
}