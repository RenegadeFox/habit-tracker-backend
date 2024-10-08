import {
  createTvShow,
  readAllTvShows,
  readTvShowById,
  readTvShowByTitle,
  updateTvShowById,
  deleteTvShowById,
} from "../models/tvShowModel.js";

// ADD a new tv show in the database
export const addTvShow = async (req, res) => {
  const isMultiple = Array.isArray(req.body);

  if (isMultiple) {
    // Request body is an array of TV Shows to be added to the database
    const tvShowsToAdd = req.body;
    const tvShowsWithIssues = [];
    try {
      const tvShowIds = await Promise.all(
        tvShowsToAdd.map(async (tvShow) => {
          const { title } = tvShow;

          if (!title) {
            tvShowsWithIssues.push({ tvShow, issue: "missing title" });
            return;
          }

          const existingtvShow = await readTvShowByTitle(title);
          if (existingtvShow) {
            tvShowsWithIssues.push({ tvShow: title, issue: "already exists" });
            return;
          }

          return await createTvShow(title);
        })
      );

      if (tvShowsWithIssues.length > 0)
        return res.status(409).send(tvShowsWithIssues);

      return res.status(201).send(tvShowIds);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else {
    // Request body is a single TV Show to be added to the database
    const { title } = req.body;

    if (!title) return res.status(400).send("Missing title");

    try {
      const tvShow = await readTvShowByTitle(title);
      if (tvShow)
        return res.status(409).send(`TV Show "${title}" already exists`);

      const tvShowId = await createTvShow(title);

      res.status(201).send({ tvShowId });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

// GET all tv shows from the database
export const getAllTvShows = async (req, res) => {
  try {
    const allTvShows = await readAllTvShows();

    if (allTvShows) return res.status(200).json(allTvShows);
    else return res.status(204).json([]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET a single tv show from the database by its ID
export const getTvShowById = async (req, res) => {
  const { id } = req.params;

  try {
    const tvShow = await readTvShowById(id);

    if (!tvShow)
      return res.status(404).send(`TV Show with ID "${id}" not found`);

    return res.status(200).json(tvShow);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET a single tv show from the database by its title
export const getTvShowByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    const tvShow = await readTvShowByTitle(title);

    if (!tvShow) return res.status(404).send(`TV Show "${title}" not found`);

    return res.status(200).json(tvShow);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// EDIT a single tv show from the database by its ID
export const editTvShowById = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) return res.status(400).send("Missing title");

  try {
    // Check if the TV show exists before updating it
    const oldTvShow = await readTvShowById(id);
    if (!oldTvShow)
      return res.status(404).send(`TV Show with ID "${id}" not found`);

    // Check if another TV show with the same title already exists
    const existingTvShow = await readTvShowByTitle(title);
    if (existingTvShow)
      return res.status(409).send(`TV Show "${title}" already exists.`);

    // Only update the fields that are provided in the request body
    const newTitle = title || oldTvShow.title;

    // Update the TV show in the database
    const changes = await updateTvShowById(id, newTitle);

    return res.status(200).send({ changes });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// REMOVE an existing tv show from the database by its ID
export const removeTvShowById = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the TV show exists before deleting it
    const tvShowToRemove = await readTvShowById(id);
    if (!tvShowToRemove)
      return res.status(404).send(`TV Show with ID "${id}" not found`);

    // Delete the TV show from the database
    const changes = await deleteTvShowById(id);

    res.status(200).send({ changes });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
