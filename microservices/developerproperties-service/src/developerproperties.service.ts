/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeveloperProperty } from './developerproperty.model';
import { Developer } from './developer.model';

@Injectable()
export class DeveloperPropertiesService {
  constructor(
    @InjectModel(DeveloperProperty.name) private developerPropertyModel: Model<DeveloperProperty>,
    @InjectModel(Developer.name) private developerModel: Model<Developer>,
  ) {}

  // Developer CRUD
  async createDeveloper(data: any): Promise<any> {
    try {
      const developer = await this.developerModel.create(data);
      return {
        status: 'success',
        data: { developer },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create developer', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllDevelopers(): Promise<any> {
    const developers = await this.developerModel.find();
    return {
      status: 'success',
      results: developers.length,
      data: { developers },
    };
  }

  async getDeveloperById(id: string): Promise<any> {
    const developer = await this.developerModel.findById(id);
    if (!developer) {
      throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      data: { developer },
    };
  }

  async updateDeveloper(id: string, data: any): Promise<any> {
    const developer = await this.developerModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!developer) {
      throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      data: { developer },
    };
  }

  async deleteDeveloper(id: string): Promise<any> {
    const developer = await this.developerModel.findByIdAndDelete(id);
    if (!developer) {
      throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Developer deleted successfully',
    };
  }

  // Developer Property CRUD
  async createProperty(data: any): Promise<any> {
    try {
      const property = await this.developerPropertyModel.create(data);
      return {
        status: 'success',
        data: { property },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create property', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllProperties(): Promise<any> {
    const properties = await this.developerPropertyModel.find().populate('developerId');
    return {
      status: 'success',
      results: properties.length,
      data: { properties },
    };
  }

  async getPropertyById(id: string): Promise<any> {
    const property = await this.developerPropertyModel.findById(id).populate('developerId');
    if (!property) {
      throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      data: { property },
    };
  }

  async updateProperty(id: string, data: any, userId?: string): Promise<any> {
    const property = await this.developerPropertyModel.findById(id);
    if (!property) {
      throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
    }
    
    // Check ownership - only developer or owner can edit
    if (userId && property.createdBy && property.createdBy !== userId) {
      throw new HttpException('You can only edit your own properties', HttpStatus.FORBIDDEN);
    }

    const updatedProperty = await this.developerPropertyModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    
    return {
      status: 'success',
      data: { property: updatedProperty },
    };
  }

  async deleteProperty(id: string, userId?: string): Promise<any> {
    const property = await this.developerPropertyModel.findById(id);
    if (!property) {
      throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
    }
    
    // Check ownership - only developer or owner can delete
    if (userId && property.createdBy && property.createdBy !== userId) {
      throw new HttpException('You can only delete your own properties', HttpStatus.FORBIDDEN);
    }

    await this.developerPropertyModel.findByIdAndDelete(id);
    return {
      status: 'success',
      message: 'Property deleted successfully',
    };
  }

  async getPropertiesByDeveloper(developerId: string): Promise<any> {
    const properties = await this.developerPropertyModel.find({ developerId }).populate('developerId');
    return {
      status: 'success',
      results: properties.length,
      data: { properties },
    };
  }
}
