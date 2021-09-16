const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const criticDetail = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function list() {
  return knex("movies").select("*");
}

function inTheaters() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function listTheatersShowing(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ movie_id: movieId, is_showing: true });
}

function listReviewsByMovie(movieId) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({ "r.movie_id": movieId })
    .then((reviews) => {
      let updatedReview = [];
      reviews.forEach((review) => {
        const criticProp = criticDetail(review);
        updatedReview.push(criticProp);
      });
      return updatedReview;
    });
}

module.exports = {
  read,
  listReviewsByMovie,
  listTheatersShowing,
  list,
  inTheaters,
};
