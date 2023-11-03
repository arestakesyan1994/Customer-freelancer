import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {}

export class updateJobStatus {
    @ApiProperty()
    num:number
}