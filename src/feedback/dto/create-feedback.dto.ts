import { ApiProperty } from "@nestjs/swagger"

export class CreateFeedbackDto {
    @ApiProperty()
    jobId: number
    @ApiProperty()
    rate: number
    @ApiProperty()
    text: string

}
