import express, { Router } from "express";

import prisma from "../lib/prisma/client";

import {
    validate,
    animalSchema,
    animalData,
} from "../lib/middelware/validation";

import { checkAuthorization } from "../lib/middelware/passport";

import { initMulterMiddleware } from "../lib/middelware/multer";

const upload = initMulterMiddleware();

const router = Router();

router.get("/", async (request, response) => {
    const animals = await prisma.animal.findMany();

    response.json(animals);
});

router.get("/:id(\\d+)", async (request, response, next) => {
    const animalID = Number(request.params.id);

    const animal = await prisma.animal.findUnique({
        where: { id: animalID },
    });

    if (!animal) {
        response.status(404);
        return next(`Cannot GET /animals/${animalID}`);
    }

    response.json(animal);
});

router.post(
    "/",
    checkAuthorization,
    validate({ body: animalSchema }),
    async (request, response) => {
        const animalData: animalData = request.body;
        const username = request.user?.username as string;

        const animal = await prisma.animal.create({
            data: { ...animalData, createdBy: username, updatedBy: username },
        });

        response.status(201).json(animal);
    }
);

router.put(
    "/:id(\\d+)",
    checkAuthorization,
    validate({ body: animalSchema }),
    async (request, response, next) => {
        const animalId = Number(request.params.id);
        const animalData: animalData = request.body;
        const username = request.user?.username as string;

        try {
            const animal = await prisma.animal.update({
                where: { id: animalId },
                data: { ...animalData, updatedBy: username },
            });

            response.status(200).json(animal);
        } catch (error) {
            response.status(404);
            next(`Cannot PUT /animals/${animalId}`);
        }
    }
);

router.delete(
    "/:id(\\d+)",
    checkAuthorization,
    async (request, response, next) => {
        const animalId = Number(request.params.id);

        try {
            await prisma.animal.delete({
                where: { id: animalId },
            });

            response.status(204).end();
        } catch (error) {
            response.status(404);
            next(`Cannot DELETE /animals/${animalId}`);
        }
    }
);

router.post(
    "/:id(\\d+)/photo",
    checkAuthorization,
    upload.single("photo"), //"photo" corrisponde al nome dell'input nel file web\upload.html
    async (request, response, next) => {
        if (!request.file) {
            response.status(400);
            return next("No photo file uploaded.");
        }

        const animalId = Number(request.params.id);
        const photoFilename = request.file.filename;

        try {
            await prisma.animal.update({
                where: { id: animalId },
                data: { photoFilename },
            });
            response.status(201).json({ photoFilename });
        } catch (error) {
            response.status(404);
            next(`Cannot POST /animals/${animalId}/photo`);
        }
    }
);

router.use("/photos", express.static("uploads"));

export default router;
