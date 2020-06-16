const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likeUsers = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!'})
  }

  const { likes } = repositories.find(rep => rep.id === id);

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!'})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({ messege: 'Repository successfully removed.'})

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!'})
  }

  const { title, url, techs, likes } = repositories.find(rep => rep.id === id);

  const { user_name } = request.headers;

  const like_user = {
    id: uuid(),
    repository_id: id,
    user_name
  }

  likeUsers.push(like_user);

  const repository = {
    id,
    title,
    url,
    techs,
    likes: likes + 1
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

app.get("/repositories/:id/likes", (request, response) => {
  const { id } = request.params;

  const results = id
    ? likeUsers.filter(like => like.repository_id.includes(id))
    : 'Repository has no like.';

    return response.status(200).json(results);
});

module.exports = app;
