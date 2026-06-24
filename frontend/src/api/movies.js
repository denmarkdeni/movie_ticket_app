import { apiJson } from "./client";

export async function getMovies() {
  return apiJson("/api/movies/");
}

export async function getMovie(id) {
  return apiJson(`/api/movies/${id}/`);
}
