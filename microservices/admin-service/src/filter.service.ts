/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Filter } from './filter.model';
import { CreateFilterDto, UpdateFilterDto } from './filter.dto';

@Injectable()
export class FilterService {
  constructor(
    @InjectModel(Filter.name) private filterModel: Model<Filter>,
  ) {}

  async create(createFilterDto: CreateFilterDto): Promise<Filter> {
    const newFilter = new this.filterModel(createFilterDto);
    return newFilter.save();
  }

  async findAll(category?: string): Promise<Filter[]> {
    if (category) {
      return this.filterModel
        .find({ category, isActive: true })
        .sort({ order: 1 })
        .exec();
    }
    return this.filterModel
      .find()
      .sort({ order: 1 })
      .exec();
  }

  async findById(id: string): Promise<Filter> {
    return this.filterModel.findById(id).exec();
  }

  async update(id: string, updateFilterDto: UpdateFilterDto): Promise<Filter> {
    return this.filterModel
      .findByIdAndUpdate(id, updateFilterDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<{ success: boolean }> {
    await this.filterModel.findByIdAndDelete(id).exec();
    return { success: true };
  }

  async findByCategory(category: string): Promise<Filter[]> {
    return this.filterModel
      .find({ category, isActive: true })
      .sort({ order: 1 })
      .exec();
  }

  async deleteByCategory(category: string): Promise<{ deletedCount: number }> {
    const result = await this.filterModel.deleteMany({ category }).exec();
    return { deletedCount: result.deletedCount };
  }
}
