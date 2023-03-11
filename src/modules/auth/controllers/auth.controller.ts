import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserEntity } from '../../user/entities/user.entity';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { AuthRegisterDto } from '../dto/auth.register.dto';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { AuthorizationGuard } from '../guards/auth.guard';
import { AuthServiceInterface } from '../interfaces/auth.service.interface';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthServiceInterface;

  @Post('/login')
  async login(
    @Body() arg: AuthLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.login(
      arg,
      req.headers['user-agent'],
    );

    res.cookie('refreshToken', response.refreshToken, { httpOnly: true });

    return plainToInstance(AuthResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }

  @Post('/register')
  async register(
    @Body() arg: AuthRegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.register(
      arg,
      req.headers['user-agent'],
    );

    res.cookie('refreshToken', response.refreshToken, { httpOnly: true });

    return plainToInstance(AuthResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new ForbiddenException('Нет токена');
    }

    const { newRefreshToken, token } = await this.authService.refresh(
      refreshToken,
      req.headers['user-agent'],
    );

    res.clearCookie('refreshToken');
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

    return {
      token,
    };
  }

  @Get('/whoami')
  @UseGuards(AuthorizationGuard)
  async whoAmI(@CurrentUser() user: UserEntity) {
    return await this.authService.getUserPreview(user);
  }
}
