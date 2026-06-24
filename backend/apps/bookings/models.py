from decimal import Decimal

from django.conf import settings
from django.db import models

from apps.movies.models import Movie
from apps.theaters.models import Screen, Seat


class Showtime(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="showtimes")
    screen = models.ForeignKey(Screen, on_delete=models.CASCADE, related_name="showtimes")
    starts_at = models.DateTimeField()
    price = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal("12.00"))

    class Meta:
        ordering = ["starts_at"]

    def __str__(self):
        return f"{self.movie.title} @ {self.screen} — {self.starts_at}"


class Booking(models.Model):
    STATUS_CONFIRMED = "confirmed"
    STATUS_CHOICES = [
        (STATUS_CONFIRMED, "Confirmed"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    showtime = models.ForeignKey(Showtime, on_delete=models.PROTECT, related_name="bookings")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_CONFIRMED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Booking #{self.pk} — {self.user.email}"


class BookingSeat(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="booking_seats")
    showtime = models.ForeignKey(Showtime, on_delete=models.PROTECT, related_name="booking_seats")
    seat = models.ForeignKey(Seat, on_delete=models.PROTECT, related_name="booking_seats")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["showtime", "seat"],
                name="unique_showtime_seat",
            ),
        ]

    def __str__(self):
        return f"{self.booking} — {self.seat.label}"
