import { z } from "zod";

export const createVehicleSchema = z.object({
  body: z.object({
    agencyId: z.uuid(),
    branchId: z.uuid(),
    makeId: z.uuid(),
    modelId: z.uuid(),
    categoryId: z.uuid(),
    year: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 1),
    plateNumber: z.string().min(1),
    vin: z.string().optional(),
    color: z.string().optional(),
    featureIds: z.array(z.string().uuid()).optional(),
  }),
});

export const updateVehicleStatusSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]),
  }),
});

export const getVehicleParamsSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>["body"];
export type UpdateVehicleStatusInput = z.infer<
  typeof updateVehicleStatusSchema
>["body"];
