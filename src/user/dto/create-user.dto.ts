import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsBoolean()
  @IsOptional()
  is_admin: boolean;
}
