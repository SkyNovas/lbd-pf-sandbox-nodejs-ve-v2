import { z } from "zod";

export const HeaderValidationSchema = z.object({
    'x-user-token': z.string({message: 'is requeried'})
});

//export type headersRequest = Zod.infer<typeof HeaderValidationSchema>

//export const BodyValidationSchema = z.object({});

//export type bodyRequest = Zod.infer<typeof HeaderValidationSchema>
