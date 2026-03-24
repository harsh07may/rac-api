import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import * as fleetSchema from './fleet.schema.js';
import * as fleetController from './fleet.controller.js';

const router = Router();

// Publicly available
router.get('/vehicles', fleetController.getVehicles);
router.get('/vehicles/:id', validate(fleetSchema.getVehicleParamsSchema), fleetController.getVehicleById);

// Protected routes (Agency/Admin)
router.post('/vehicles', authenticate, validate(fleetSchema.createVehicleSchema), fleetController.createVehicle);
router.patch('/vehicles/:id/status', authenticate, validate(fleetSchema.updateVehicleStatusSchema), fleetController.updateVehicleStatus);

export default router;
