const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const foundMovie = await service.read(movieId);
  if (foundMovie) {
    res.locals.movie = foundMovie;
    return next();
  }
  return next({ status: 404, message: "Movie cannot be found." });
}

function read(req, res) {
  res.send({ data: res.locals.movie });
}

async function listReviewsByMovie(req, res) {
  const data = await service.listReviewsByMovie(res.locals.movie.movie_id);
  res.send({ data });
}

async function listTheatersShowing(req, res) {
  const data = await service.listTheatersShowing(
    res.locals.movie.movie_id
  );
  res.send({ data });
}

async function list(req, res) {
  if (req.query.is_showing) {
    res.send({ data: await service.inTheaters() });
  } else {
    res.send({ data: await service.list() });
  }
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  listReviews: [asyncErrorBoundary(movieExists), listReviewsByMovie],
  listTheatersShowing: [asyncErrorBoundary(movieExists), listTheatersShowing],
  list,
};
