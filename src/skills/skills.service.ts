import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {

  constructor(
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) { }


  async create(createSkillDto: CreateSkillDto) {
    const skill = await this.skillRepository.find()
    if (skill.some(elm => elm.name.toLowerCase() == createSkillDto.name.toLowerCase())) {
      throw new UnauthorizedException(createSkillDto.name + " has already")
    } else {
      await this.skillRepository.save(createSkillDto)
      return 'adds a new skill';
    }
  }

  async findAll() {
    return this.skillRepository.find();
  }

  async findOne(id: number) {
    const skill = await this.skillRepository.findOne({
      where: {
        id: id
      },
      relations: {
        skills:true
      }
    })
    if (!skill) {
      throw new NotFoundException("skill not fount")
    } else {
      return skill
    }
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    const skill = await this.skillRepository.findOne({
      where: {
        id: id
      }
    })
    if (skill) {
      await this.skillRepository.update({ id }, updateSkillDto);
      return 'Updated skill - ' + skill.name;
    } else {
      return new NotFoundException('skill not found');
    }
  }

  async remove(id: number) {
    const us = await this.skillRepository.findOneBy({ id });
    if (us) {
      this.skillRepository.delete({ id })
      return "delete skill - " + us.name;
    } else {
      throw new NotFoundException('skill not found');
    }
  }
}