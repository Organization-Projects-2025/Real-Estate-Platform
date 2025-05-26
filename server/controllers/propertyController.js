const catchAsync = require('../utils/catchAsync');
const ServiceLocator = require('../core/ServiceLocator');
const PropertyService = require('../services/PropertyService');

// Register the PropertyService
ServiceLocator.register('propertyService', new PropertyService());

// Get the property service instance
const propertyService = ServiceLocator.get('propertyService');

exports.createProperty = catchAsync(async (req, res) => {
  const property = await propertyService.execute('create', req.body);
  res.status(201).json({
    status: 'success',
    data: {
      property,
    },
  });
});

exports.updatePropertyById = catchAsync(async (req, res) => {
  const property = await propertyService.execute('update', {
    id: req.params.id,
    updateData: req.body,
  });
  res.status(200).json({
    status: 'success',
    data: {
      property,
    },
  });
});

exports.deletePropertyById = catchAsync(async (req, res) => {
  await propertyService.execute('delete', { id: req.params.id });
  res.status(200).json({
    status: 'success',
    message: 'Property deleted successfully',
    data: null,
  });
});

exports.getAllProperties = catchAsync(async (req, res) => {
  const properties = await propertyService.execute('getAll');
  res.status(200).json({
    status: 'success',
    results: properties.length,
    data: {
      properties,
    },
  });
});

exports.getPropertyById = catchAsync(async (req, res) => {
  const property = await propertyService.execute('getById', {
    id: req.params.id,
  });
  res.status(200).json({
    status: 'success',
    data: {
      property,
    },
  });
});

//this is not for use, for development to batch clean test/corrupted entries!!!!!!!!!
// exports.NUKE = catchAsync(async (req, res) => {
//   const deletedProperty = await propertyModel.deleteMany();

//   if (!deletedProperty) {
//     return res.status(404).json({
//       status: 'fail',
//       message: `No property found with ID: ${id}`,
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: null,
//   });
// });
