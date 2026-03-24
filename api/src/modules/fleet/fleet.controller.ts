import type { Request, Response, NextFunction } from "express";
import * as fleetService from "./fleet.service.js";
import { sendSuccess, sendCreated } from "../../lib/response.js";
import type {
  UpdateVehicleStatusInput,
  CreateVehicleInput,
} from "./fleet.schema.js";

export async function createVehicle(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = req.body as CreateVehicleInput;
    const vehicle = await fleetService.createVehicle(input);
    sendCreated(res, vehicle);
  } catch (err) {
    next(err);
  }
}

export async function getVehicles(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vehicles = await fleetService.getVehicles();
    sendSuccess(res, vehicles);
  } catch (err) {
    next(err);
  }
}

export async function getVehicleById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;
    const vehicle = await fleetService.getVehicleById(id);
    sendSuccess(res, vehicle);
  } catch (err) {
    next(err);
  }
}

export async function updateVehicleStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;
    const input = req.body as UpdateVehicleStatusInput;
    const updatedVehicle = await fleetService.updateVehicleStatus(id, input);
    sendSuccess(res, updatedVehicle);
  } catch (err) {
    next(err);
  }
}
