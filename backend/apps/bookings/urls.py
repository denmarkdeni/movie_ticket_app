from django.urls import path

from .views import BookingCreateView, MyBookingsView, ShowtimeSeatMapView

urlpatterns = [
    path("showtimes/<int:pk>/seats/", ShowtimeSeatMapView.as_view(), name="showtime-seats"),
    path("bookings/", BookingCreateView.as_view(), name="booking-create"),
    path("bookings/me/", MyBookingsView.as_view(), name="my-bookings"),
]
