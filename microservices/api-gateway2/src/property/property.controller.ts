/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PropertyService } from './property.service';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async create(@Body() propertyData: any) {
    return this.propertyService.create(propertyData);
  }

  @Get()
  async findAll() {
    return this.propertyService.findAll();
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit: number = 6) {
    return this.propertyService.getFeatured(limit);
  }

  @Get('search')
  async search(@Query() filters: any) {
    return this.propertyService.search(filters);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.propertyService.findByUser(userId);
  }

  @Get('type/:listingType')
  async findByListingType(@Param('listingType') listingType: string) {
    return this.propertyService.findByListingType(listingType);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.propertyService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.propertyService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.propertyService.delete(id);
  }
}
