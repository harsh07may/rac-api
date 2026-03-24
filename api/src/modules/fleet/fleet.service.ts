import prisma from '../../config/db.js';
import { logger } from '../../config/logger.js';
import { AppError, NotFound, Conflict } from '../../lib/AppError.js';
import type { CreateVehicleInput, UpdateVehicleStatusInput } from './fleet.schema.js';

export async function createVehicle(input: CreateVehicleInput) {
  // Check if plate number already exists
  const existing = await prisma.vehicle.findUnique({ where: { plateNumber: input.plateNumber } });
  if (existing) throw Conflict('A vehicle with this plate number already exists');

  if (input.vin) {
    const existingVin = await prisma.vehicle.findUnique({ where: { vin: input.vin } });
    if (existingVin) throw Conflict('A vehicle with this VIN already exists');
  }

  // Define features to connect if provided
  const featureConnections = input.featureIds?.map((id) => ({ id })) || [];

  const vehicle = await prisma.vehicle.create({
    data: {
      agencyId: input.agencyId,
      branchId: input.branchId,
      makeId: input.makeId,
      modelId: input.modelId,
      categoryId: input.categoryId,
      year: input.year,
      plateNumber: input.plateNumber,
      vin: input.vin ?? null,
      color: input.color ?? null,
      status: 'AVAILABLE',
      features: { connect: featureConnections },
    },
    include: {
      make: true,
      model: true,
      category: true,
      features: true,
    },
  });

  logger.info({ vehicleId: vehicle.id }, 'Vehicle created');
  return vehicle;
}

export async function getVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      make: true,
      model: true,
      category: true,
      branch: true,
      features: true,
    },
  });
  return vehicles;
}

export async function getVehicleById(id: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      make: true,
      model: true,
      category: true,
      branch: { include: { agency: true } },
      features: true,
      rates: true,
    },
  });

  if (!vehicle) throw NotFound('Vehicle');
  return vehicle;
}

export async function updateVehicleStatus(id: string, input: UpdateVehicleStatusInput) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw NotFound('Vehicle');

  const updatedVehicle = await prisma.vehicle.update({
    where: { id },
    data: { status: input.status },
  });

  logger.info({ vehicleId: vehicle.id, newStatus: input.status }, 'Vehicle status updated');
  return updatedVehicle;
}
