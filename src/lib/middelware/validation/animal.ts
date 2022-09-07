import { Static, Type } from "@sinclair/typebox";

export const animalSchema = Type.Object({
    breed: Type.String(),
    weight: Type.Integer(),
    name: Type.Optional(Type.String()),
}, {additionalProperties: false});

export type animalData = Static<typeof animalSchema>
