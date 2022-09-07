import cors from "cors";

export function initCorsrMiddleware() {
    const corsOptions = {
        origin: "http://localhost:8080",
        credentials: true,
    };

    return cors(corsOptions);
}
