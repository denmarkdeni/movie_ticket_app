import { apiJson } from "./client";

export async function getShowtimeSeats(showtimeId) {
  return apiJson(`/api/showtimes/${showtimeId}/seats/`);
}

export async function createBooking(showtimeId, seatIds) {
  return apiJson("/api/bookings/", {
    method: "POST",
    body: JSON.stringify({ showtime_id: showtimeId, seat_ids: seatIds }),
  });
}

export async function getMyBookings() {
  return apiJson("/api/bookings/me/");
}
