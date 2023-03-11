import { PickType } from '@nestjs/swagger';
import { AuthLoginDto } from './auth.login.dto';

export class AuthRegisterDto extends PickType(AuthLoginDto, [
  'login',
  'password',
]) {}
