/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Agent, AgentDocument } from './agent.model';

@Injectable()
export class AgentService {
  constructor(
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
  ) {}

  async create(agentData: any): Promise<any> {
    try {
      // Check if agent already exists
      const existingAgent = await this.agentModel.findOne({ email: agentData.email });
      if (existingAgent) {
        throw new HttpException('Agent already exists with this email', HttpStatus.BAD_REQUEST);
      }

      // Hash password
      if (agentData.password) {
        agentData.password = await bcrypt.hash(agentData.password, 12);
      }

      const agent = await this.agentModel.create(agentData);
      
      // Remove password from response
      const agentObj = agent.toObject();
      delete agentObj.password;

      return {
        status: 'success',
        data: { agent: agentObj },
      };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create agent', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<any> {
    const agents = await this.agentModel.find().select('-password');
    return {
      status: 'success',
      results: agents.length,
      data: { agents },
    };
  }

  async findById(id: string): Promise<any> {
    const agent = await this.agentModel.findById(id).select('-password');
    if (!agent) {
      throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      data: { agent },
    };
  }

  async update(id: string, updateData: any): Promise<any> {
    // Don't allow password update through this method
    delete updateData.password;

    const agent = await this.agentModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!agent) {
      throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: 'success',
      data: { agent },
    };
  }

  async delete(id: string): Promise<any> {
    const agent = await this.agentModel.findByIdAndDelete(id);
    if (!agent) {
      throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Agent deleted successfully',
    };
  }

  async getPhoneNumber(id: string): Promise<any> {
    const agent = await this.agentModel.findById(id).select('phoneNumber');
    if (!agent) {
      throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      data: { phoneNumber: agent.phoneNumber },
    };
  }

  async findByEmail(email: string): Promise<any> {
    const agent = await this.agentModel.findOne({ email }).select('-password');
    if (!agent) {
      throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      data: { agent },
    };
  }
}
