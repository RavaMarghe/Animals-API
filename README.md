# api-project

Node.js API project

//Routes:
// Get /planets - Retrive all planets
app.get("/planets", (request, response) => {});

// Get /planets/:id - Retrive a single planet
app.get("/planets/:id", (request, response) => {});

// POST /planets - Create a new planet
app.post("/planets", (request, response) => {});

// PUT /planets/:id - Replace an existing planet
app.put("/planets/:id", (request, response) => {});

// DELETE /planets/:id - Remove a planet
app.delete("/planets/:id", (request, response) => {});

// POST /planets/:id/photo - Add a photo for a planet
app.post("/planets/:id/photo", (request, response) => {});
