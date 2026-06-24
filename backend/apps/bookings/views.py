from django.db import IntegrityError, transaction
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Booking, BookingSeat, Showtime
from .serializers import (
    BookingCreateSerializer,
    BookingDetailSerializer,
    ShowtimeSeatMapSerializer,
)


class ShowtimeSeatMapView(generics.RetrieveAPIView):
    queryset = Showtime.objects.select_related("movie", "screen__theater")
    serializer_class = ShowtimeSeatMapSerializer
    permission_classes = [AllowAny]


class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        showtime = serializer.validated_data["showtime"]
        seats = serializer.validated_data["seats"]

        try:
            with transaction.atomic():
                booking = Booking.objects.create(
                    user=request.user,
                    showtime=showtime,
                    status=Booking.STATUS_CONFIRMED,
                )
                BookingSeat.objects.bulk_create(
                    [
                        BookingSeat(
                            booking=booking,
                            showtime=showtime,
                            seat=seat,
                        )
                        for seat in seats
                    ]
                )
        except IntegrityError:
            raise ValidationError({"seat_ids": "One or more seats were just booked by someone else."})

        booking = Booking.objects.select_related(
            "showtime__movie",
            "showtime__screen__theater",
        ).prefetch_related("booking_seats__seat").get(pk=booking.pk)

        return Response(
            BookingDetailSerializer(booking).data,
            status=status.HTTP_201_CREATED,
        )


class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects.filter(user=self.request.user)
            .select_related("showtime__movie", "showtime__screen__theater")
            .prefetch_related("booking_seats__seat")
        )
