module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    clearMocks: true,
    setupFilesAfterEnv: [
        "./src/lib/prisma/client.mock.ts",
        "./src/lib/middelware/multer.mock.ts",
        "./src/lib/middelware/passport.mock.ts"
    ],
};
