// A web server using the 'express' library
const express = require("express");
const app = express();
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

// Middlewares
// json parser for request.body
app.use(express.json());
// log request info
morgan.token("data", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : " ";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
// allow requests from all origins
app.use(cors());
// show static frontend
app.use(express.static("build"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.send(
        `<p>Phonebook stores ${people.length} people</p><p>${new Date()}</p>`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response, next) => {
  Person.find(request.body.filterCond)
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  console.log(person);

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
