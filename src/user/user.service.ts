import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { And, getConnection, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { Role } from 'src/user/role/role.enum';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { v4 as uuidv4 } from 'uuid';
import { UserSkill } from 'src/user-skills/entities/user-skill.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { FreelancerService } from 'src/freelancer/freelancer.service';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly freelancerService: FreelancerService,
    private readonly customerService: CustomerService
  ) { }


  async create(createUserDto: CreateUserDto) {
    const users = await this.userRepository.find({
      where: {
        email: createUserDto.email
      }
    })
    console.log(users);

    if (users.length) {
      throw new UnauthorizedException("Oops! email has already")
    } else if (createUserDto.role == Role.FREELANCER && !createUserDto.profesion) {
      throw new UnauthorizedException("Oops! Freelancer must have profesion")
    } else if (createUserDto.role == Role.CUSTOMER && createUserDto.profesion) {
      throw new UnauthorizedException("Oops! Customer already have profesion")
    }
    const { password, profesion, description,  salary, ...body } = createUserDto
    const hash = await bcrypt.hash(password, 10)
    const emailToken = uuidv4();
    const user = this.userRepository.create({ ...body, password: hash, isVerified: 0, emailToken });
    const us = await this.userRepository.save(user);

    if(us.role == Role.CUSTOMER){
      await this.customerService.create({userId:us.id, description})
    }else if(us.role == Role.FREELANCER){
      await this.freelancerService.create({
        userId:us.id,
        salary:salary,
        profesion:profesion
      })
    }

    const url = `http://localhost:3000/verify?email=${body.email}&emailToken=${emailToken}`;
    // await this.mailerService.sendMail({
    //   to: body.email,
    //   from: '...',
    //   subject: 'Welcome to CustomerFreelancer page! Confirm your Email',
    //   html: `Hi! There, You have recently visited 
    //   our website and entered your email.
    //   Please follow the given link to verify your email
    //   <a href='${url}'>click</a>       
    //   Thanks`
    // });
    return "add user"
  }

  findAll() {
    return this.userRepository.find();
  }


  async verify(user: { email: string, emailToken: string }) {
    const us = await this.userRepository.findOne({
      where: {
        email: user.email,
        emailToken: user.emailToken
      },
      relations:{
        freelancer:true,
        customer:true
      }
    })
    if (us) {
      await this.userRepository.update({ id: us.id }, { emailToken: null, isVerified: 1 })
      return "you are verified"
    } else {
      throw new NotFoundException("Oops! data not found")
    }

  }

  async findOne(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: username
      },
      relations: {
        freelancer:true,
        customer:true
      }
    });
    if (!user) {
      throw new UnauthorizedException("Oops! Oops! user not fount")
    } else {
      return user
    }
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id
      },
      relations: ['skills']
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const us = await this.userRepository.findOneBy({ id });
    if (us) {
      this.userRepository.update({ id }, updateUserDto)
      return "update user - " + us.name;
    } else {
      throw new NotFoundException('Oops! user not found');
    }
  }

  async remove(id: number) {
    const us = await this.userRepository.findOneBy({ id });
    if (us) {
      this.userRepository.delete({ id })
      return "delete user - " + us.name;
    } else {
      throw new NotFoundException('Oops! user not found');
    }
  }
}
