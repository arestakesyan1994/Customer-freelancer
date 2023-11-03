import { Controller, Get, UseGuards, Post, Request, Body, UploadedFile, UseInterceptors, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { HasRoles } from './auth/has-roles.decorator';
import { Role } from './user/role/role.enum';
import { RolesGuard } from './auth/roles.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user/user.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './user/dto/create-user.dto';

export class Us {
  @ApiProperty()
  username: string
  @ApiProperty()
  password: string
}

@ApiTags("Auth*")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly userSerevice: UserService,
    private authService: AuthService) { }


  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() us: Us,@Request() req) {
    console.log(us);    
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/register")
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const data = await this.userSerevice.create(createUserDto);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req, @Res() res: Response) {
    try {
      const data = await this.userSerevice.findOne(req.user.username)
      return res.status(HttpStatus.OK).json({ user: data })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.FREELANCER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('freelancer')
  onlyFreelancer(@Request() req) {
    return req.user;
  }

  
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('customer')
  onlyCustomer(@Request() req) {
    return req.user;
  }

}
