import supertest from "supertest";
import { prismaMock } from "../lib/prisma/client.mock";
import app from "../app";

const request = supertest(app);

describe("GET /animals", () => {
    test("Valid request", async () => {
        const animals = [
            {
                id: 1,
                breed: "Snake",
                weight: 23,
                name: null,
                photoFilename: null,
                createdAt: "2022-09-07T08:36:06.122Z",
                createdBy: null,
                updatedAt: "2022-09-07T08:35:41.815Z",
                updatedBy: null,
            },
            {
                id: 2,
                breed: "Penguin",
                weight: 37,
                name: null,
                photoFilename: null,
                createdAt: "2022-09-07T08:36:24.554Z",
                createdBy: null,
                updatedAt: "2022-09-07T08:36:35.246Z",
                updatedBy: null,
            },
        ];

        // @ts-ignore
        prismaMock.animal.findMany.mockResolvedValue(animals);

        const response = await request
            .get("/animals")
            .expect(200)
            .expect("Content-type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");

        expect(response.body).toEqual(animals);
    });
});

describe("GET /animals/:id", () => {
    test("Valid request", async () => {
        const animal = {
            id: 1,
            breed: "Snake",
            weight: 23,
            name: null,
            photoFilename: null,
            createdAt: "2022-09-07T08:36:06.122Z",
            createdBy: null,
            updatedAt: "2022-09-07T08:35:41.815Z",
            updatedBy: null,
        };

        // @ts-ignore
        prismaMock.animal.findUnique.mockResolvedValue(animal);

        const response = await request
            .get("/animals/1")
            .expect(200)
            .expect("Content-type", /application\/json/);
        expect(response.body).toEqual(animal);
    });

    test("animal does not exist", async () => {
        // @ts-ignore
        prismaMock.animal.findUnique.mockResolvedValue(null);
        const response = await request
            .get("/animals/37")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /animals/37");
    });

    test("Invalid animal ID", async () => {
        const response = await request
            .get("/animals/asdf")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /animals/asdf");
    });
});

describe("POST /animals", () => {
    test("Valid request", async () => {
        const animal = {};

        // @ts-ignore
        prismaMock.animal.create.mockResolvedValue(animal);

        const response = await request
            .post("/animals")
            .send({
                breed: "Giraffe",
                weight: 894,
                name: null,
            })
            .expect(201)
            .expect("Content-type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");

        expect(response.body).toEqual(animal);
    });

    test("Invalid request", async () => {
        const animal = {
            breed: "Giraffe",
            name: null,
        };

        const response = await request
            .post("/animals")
            .send(animal)
            .expect(422)
            .expect("Content-type", /application\/json/);
        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });
});

describe("PUT /animals/:id", () => {
    test("Valid request", async () => {
        const animal = {
            id: 2,
            breed: "Penguin",
            weight: 37,
            name: null,
            photoFilename: null,
            createdAt: "2022-09-07T08:36:24.554Z",
            createdBy: null,
            updatedAt: "2022-09-07T08:36:35.246Z",
            updatedBy: null,
        };

        // @ts-ignore
        prismaMock.animal.update.mockResolvedValue(animal);

        const response = await request
            .put("/animals/2")
            .send({
                breed: "Penguin",
                weight: 37,
                name: "Skipper",
            })
            .expect(200)
            .expect("Content-type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");

        expect(response.body).toEqual(animal);
    });

    test("Invalid request", async () => {
        const animal = {
            breed: "Penguin",
            name: "Skipper",
        };

        const response = await request
            .put("/animals/2")
            .send(animal)
            .expect(422)
            .expect("Content-type", /application\/json/);
        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });

    test("animal does not exist", async () => {
        // @ts-ignore
        prismaMock.animal.update.mockRejectedValue(new Error("Error"));

        const response = await request
            .put("/animals/37")
            .send({
                breed: "Penguin",
                weight: 37,
                name: "Skipper",
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /animals/37");
    });

    test("Invalid animal ID", async () => {
        const response = await request
            .put("/animals/asdf")
            .send({
                name: "Mercury",
                description: "Lovely animal",
                diameter: 1234,
                moons: 12,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /animals/asdf");
    });
});

describe("DELETE /animals/:id", () => {
    test("Valid request", async () => {
        const response = await request
            .delete("/animals/4")
            .expect(204)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");

        expect(response.text).toEqual("");
    });

    test("animal does not exist", async () => {
        // @ts-ignore
        prismaMock.animal.delete.mockRejectedValue(new Error("Error"));
        const response = await request
            .delete("/animals/1")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /animals/1");
    });

    test("Invalid animal ID", async () => {
        const response = await request
            .delete("/animals/asdf")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /animals/asdf");
    });
});

describe("POST /animals/:id/photo ", () => {
    test("Valid request with PNG file upload", async () => {
        await request
            .post("/animals/6/photo")
            .attach("photo", "test-fixtures/photos/file.png")
            .expect(201)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");
    });

    test("Valid request with JPG file upload", async () => {
        await request
            .post("/animals/6/photo")
            .attach("photo", "test-fixtures/photos/file.jpg")
            .expect(201)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080")
            .expect("Access-Control-Allow-Credentials", "true");
    });

    test("Invalid request with text file upload", async () => {
        const response = await request
            .post("/animals/6/photo")
            .attach("photo", "test-fixtures/photos/file.txt")
            .expect(500)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain(
            "Error: The uploaded file must be a JPEG or a PNG image."
        );
    });

    test("animal does not exist", async () => {
        // @ts-ignore
        prismaMock.animal.update.mockRejectedValue(new Error("Error"));

        const response = await request
            .post("/animals/1/photo")
            .attach("photo", "test-fixtures/photos/file.png")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot POST /animals/1/photo");
    });

    test("Invalid animal ID", async () => {
        const response = await request
            .post("/animals/asdf/photo")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot POST /animals/asdf/photo");
    });

    test("Invalid test with no file upload", async () => {
        const response = await request
            .post("/animals/6/photo")
            .expect(400)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("No photo file uploaded.");
    });
});
