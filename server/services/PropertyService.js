const BaseService = require('../core/BaseService');
const Property = require('../models/propertyModel');
const AppError = require('../utils/appError');

class PropertyService extends BaseService {
  constructor() {
    super();
  }

  async perform(action, data) {
    switch (action) {
      case 'create':
        return this.createProperty(data);
      case 'update':
        return this.updateProperty(data);
      case 'delete':
        return this.deleteProperty(data);
      case 'getAll':
        return this.getAllProperties();
      case 'getById':
        return this.getPropertyById(data);
      default:
        throw new Error('Invalid action');
    }
  }

  async createProperty(propertyData) {
    const newProperty = await Property.create(propertyData);
    return newProperty;
  }

  async updateProperty({ id, updateData }) {
    const property = await Property.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      throw new AppError(`No property found with ID: ${id}`, 404);
    }

    return property;
  }

  async deleteProperty({ id }) {
    const property = await Property.findById(id);
    if (!property) {
      throw new AppError(`No property found with ID: ${id}`, 404);
    }

    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      throw new AppError('Failed to delete property. Please try again.', 500);
    }

    return null;
  }

  async getAllProperties() {
    const properties = await Property.find();
    return properties;
  }

  async getPropertyById({ id }) {
    const property = await Property.findById(id);
    if (!property) {
      throw new AppError(`No property found with ID: ${id}`, 404);
    }
    return property;
  }
}

module.exports = PropertyService;
