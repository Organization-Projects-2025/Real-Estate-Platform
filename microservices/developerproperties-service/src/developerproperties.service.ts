/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeveloperProperty } from './developerproperty.model';
import { Developer } from './developer.model';
import { Project } from './project.model';

@Injectable()
export class DeveloperPropertiesService {
  constructor(
    @InjectModel(DeveloperProperty.name) private developerPropertyModel: Model<DeveloperProperty>,
    @InjectModel(Developer.name) private developerModel: Model<Developer>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) { }

  // Project CRUD
  async createProject(data: any): Promise<any> {
    try {
      const project = await this.projectModel.create(data);
      return {
        status: 'success',
        data: { project },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create project', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllProjects(): Promise<any> {
    const projects = await this.projectModel.find();
    return {
      status: 'success',
      results: projects.length,
      data: { projects },
    };
  }

  async getProjectById(id: string): Promise<any> {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      data: { project },
    };
  }

  async getProjectsByUser(userId: string): Promise<any> {
    const projects = await this.projectModel.find({ developerId: userId });
    return {
      status: 'success',
      results: projects.length,
      data: { projects },
    };
  }

  async updateProject(id: string, data: any): Promise<any> {
    const project = await this.projectModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      data: { project },
    };
  }

  async deleteProject(id: string): Promise<any> {
    const project = await this.projectModel.findByIdAndDelete(id);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Project deleted successfully',
    };
  }

  async updateProjectForUser(userId: string, projectId: string, data: any): Promise<any> {
    const project = await this.projectModel.findOne({ _id: projectId, developerId: userId });
    if (!project) {
      throw new HttpException('Project not found or you do not have permission to edit it', HttpStatus.NOT_FOUND);
    }

    const updatedProject = await this.projectModel.findByIdAndUpdate(projectId, data, {
      new: true,
      runValidators: true,
    });

    return {
      status: 'success',
      data: { project: updatedProject },
    };
  }

  async deleteProjectForUser(userId: string, projectId: string): Promise<any> {
    const project = await this.projectModel.findOne({ _id: projectId, developerId: userId });
    if (!project) {
      throw new HttpException('Project not found or you do not have permission to delete it', HttpStatus.NOT_FOUND);
    }

    await this.projectModel.findByIdAndDelete(projectId);
    return {
      status: 'success',
      message: 'Project deleted successfully',
    };
  }

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
    const properties = await this.developerPropertyModel.find().populate('projectId');
    return {
      status: 'success',
      results: properties.length,
      data: { properties },
    };
  }

  async getPropertyById(id: string): Promise<any> {
    try {
      const property = await this.developerPropertyModel.findById(id);
      if (!property) {
        throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: 'success',
        data: { property },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Error fetching developer property', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  async getPropertiesByProject(projectId: string): Promise<any> {
    const properties = await this.developerPropertyModel.find({ projectId }).populate('projectId');
    return {
      status: 'success',
      results: properties.length,
      data: { properties },
    };
  }

  async createPropertyForProject(userId: string, projectId: string, data: any): Promise<any> {
    try {
      // Verify project belongs to user
      const project = await this.projectModel.findOne({ _id: projectId, developerId: userId });
      if (!project) {
        throw new HttpException('Project not found or you do not have permission', HttpStatus.NOT_FOUND);
      }

      const propertyData = { ...data, developerId: userId, projectId };
      const property = await this.developerPropertyModel.create(propertyData);
      return {
        status: 'success',
        data: { property },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create property', HttpStatus.BAD_REQUEST);
    }
  }

  async getPropertiesByUser(userId: string): Promise<any> {
    const properties = await this.developerPropertyModel.find({ developerId: userId });
    return {
      status: 'success',
      results: properties.length,
      data: { properties },
    };
  }

  async createPropertyForUser(userId: string, data: any): Promise<any> {
    try {
      const propertyData = { ...data, developerId: userId };
      const property = await this.developerPropertyModel.create(propertyData);
      return {
        status: 'success',
        data: { property },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create property', HttpStatus.BAD_REQUEST);
    }
  }

  async updatePropertyForUser(userId: string, propertyId: string, data: any): Promise<any> {
    const property = await this.developerPropertyModel.findOne({ _id: propertyId, developerId: userId });
    if (!property) {
      throw new HttpException('Property not found or you do not have permission to edit it', HttpStatus.NOT_FOUND);
    }

    const updatedProperty = await this.developerPropertyModel.findByIdAndUpdate(propertyId, data, {
      new: true,
      runValidators: true,
    });

    return {
      status: 'success',
      data: { property: updatedProperty },
    };
  }

  async deletePropertyForUser(userId: string, propertyId: string): Promise<any> {
    const property = await this.developerPropertyModel.findOne({ _id: propertyId, developerId: userId });
    if (!property) {
      throw new HttpException('Property not found or you do not have permission to delete it', HttpStatus.NOT_FOUND);
    }

    await this.developerPropertyModel.findByIdAndDelete(propertyId);
    return {
      status: 'success',
      message: 'Property deleted successfully',
    };
  }
  async getProjectsWithPropertiesByDeveloper(developerId: string): Promise<any> {
    try {
      // Fetch all projects for the developer
      const projects = await this.projectModel.find({ developerId }).lean().exec();

      // Fetch all properties for the developer
      const properties = await this.developerPropertyModel.find({ developerId }).lean().exec();

      // Map properties to projects
      const projectsWithProperties = projects.map((project) => {
        const projectProperties = properties.filter(
          (property) => String(property.projectId) === String(project._id)
        );

        return {
          ...project,
          properties: projectProperties,
        };
      });

      return {
        status: 'success',
        results: projectsWithProperties.length,
        data: { projects: projectsWithProperties },
      };
    } catch (error) {
      console.error('Error in getProjectsWithPropertiesByDeveloper:', error);
      throw new HttpException(error.message || 'Failed to fetch projects with properties', HttpStatus.BAD_REQUEST);
    }
  }
}
