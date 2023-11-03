import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty()
    name:string
    @ApiProperty()
    surname:string
    @ApiProperty()
    email:string
    @ApiProperty()
    password:string
    @ApiProperty()
    profesion:string
    @ApiProperty()
    role:number
    @ApiProperty()
    salary:number
    @ApiProperty()
    description:string
}
