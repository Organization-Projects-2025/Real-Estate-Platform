/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { firstValueFrom } from 'rxjs';

@Controller('filters')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createFilter(@Body() createFilterDto: any) {
    return firstValueFrom(this.adminService.createFilter(createFilterDto));
  }

  @Get()
  async getAllFilters(@Query('category') category?: string) {
    return firstValueFrom(this.adminService.getAllFilters(category));
  }

  @Get('category/:category')
  async getFiltersByCategory(@Param('category') category: string) {
    return firstValueFrom(this.adminService.getFiltersByCategory(category));
  }

  @Get(':id')
  async getFilterById(@Param('id') id: string) {
    return firstValueFrom(this.adminService.getFilterById(id));
  }

  @Put(':id')
  async updateFilter(@Param('id') id: string, @Body() updateFilterDto: any) {
    return firstValueFrom(this.adminService.updateFilter(id, updateFilterDto));
  }

  @Delete(':id')
  async deleteFilter(@Param('id') id: string) {
    return firstValueFrom(this.adminService.deleteFilter(id));
  }

  @Delete('category/:category')
  async deleteCategoryFilters(@Param('category') category: string) {
    return firstValueFrom(this.adminService.deleteCategoryFilters(category));
  }
}
