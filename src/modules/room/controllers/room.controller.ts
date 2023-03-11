import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthorizationGuard } from '../../auth/guards/auth.guard';
import { UserEntity } from '../../user/entities/user.entity';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomPreviewDto } from '../dto/room.preview.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { RoomServiceInterface } from '../interfaces/room.service.interface';
import { RoomService } from '../services/room.service';

@ApiTags('Room')
@UseGuards(AuthorizationGuard)
@Controller('/room')
export class RoomController {
  @Inject(RoomService)
  private roomService: RoomServiceInterface;

  @ApiOperation({ description: 'Создать комнату' })
  @ApiResponse({ type: RoomPreviewDto })
  @Post()
  async createRoom(
    @CurrentUser() user: UserEntity,
    @Body() arg: CreateRoomDto,
  ) {
    return await this.roomService.createRoom(user, arg);
  }

  @ApiOperation({ description: 'Получить список комнат пользователя' })
  @ApiResponse({ type: RoomPreviewDto, isArray: true })
  @Get('/list')
  async getUserRoomList(@CurrentUser() user: UserEntity) {
    return await this.roomService.getAllUserRooms(user);
  }

  @ApiOperation({ description: 'Обновить комнату' })
  @ApiResponse({ type: RoomPreviewDto })
  @Put()
  async updateRoom(
    @CurrentUser() user: UserEntity,
    @Body() arg: UpdateRoomDto,
  ) {
    return await this.roomService.updateRoom(user, arg);
  }

  @ApiOperation({ description: 'Удалить комнату' })
  @ApiResponse({ type: RoomPreviewDto })
  @Delete(':id')
  async deleteRoom(@CurrentUser() user: UserEntity, @Param('id') id: number) {
    return await this.roomService.deleteRoom(user, id);
  }
}
