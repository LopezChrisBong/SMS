import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateSubjectDto {

    @ApiProperty()
    subject_title: string;

    @ApiProperty()
    seniorJunior:string;

    @ApiProperty()
    grade_level:string;

    @ApiProperty()
    date_from:string;

    @ApiProperty()
    date_to:string;

    @ApiProperty()
    school_yearId:number;

}
