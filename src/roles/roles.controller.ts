import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // ---------- Create role ---------- //

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  // ---------- Find all roles ---------- //

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.rolesService.findAll();
  }

  // ---------- Find one role by Id ---------- //

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: RoleEntity['id']) {
    return this.rolesService.findOne(id);
  }

  // ---------- Update Role ---------- //

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: RoleEntity['id'], @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  // ---------- Remove Role ---------- //

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: RoleEntity['id']) {
    return this.rolesService.remove(id);
  }
}
