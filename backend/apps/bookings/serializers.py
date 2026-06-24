from rest_framework import serializers

from apps.theaters.models import Seat

from .models import Booking, BookingSeat, Showtime


class SeatAvailabilitySerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = ("id", "row", "number", "label", "status")

    def get_status(self, obj):
        booked_seat_ids = self.context.get("booked_seat_ids", set())
        return "booked" if obj.id in booked_seat_ids else "available"


class ShowtimeSeatMapSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source="movie.title", read_only=True)
    theater_name = serializers.CharField(source="screen.theater.name", read_only=True)
    screen_name = serializers.CharField(source="screen.name", read_only=True)
    seats = serializers.SerializerMethodField()

    class Meta:
        model = Showtime
        fields = (
            "id",
            "starts_at",
            "price",
            "movie_title",
            "theater_name",
            "screen_name",
            "seats",
        )

    def get_seats(self, showtime):
        booked_seat_ids = set(
            BookingSeat.objects.filter(showtime=showtime).values_list("seat_id", flat=True)
        )
        seats = showtime.screen.seats.all()
        return SeatAvailabilitySerializer(
            seats,
            many=True,
            context={"booked_seat_ids": booked_seat_ids},
        ).data


class BookingCreateSerializer(serializers.Serializer):
    showtime_id = serializers.IntegerField()
    seat_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False,
    )

    def validate(self, attrs):
        showtime_id = attrs["showtime_id"]
        seat_ids = attrs["seat_ids"]

        try:
            showtime = Showtime.objects.select_related("screen").get(pk=showtime_id)
        except Showtime.DoesNotExist:
            raise serializers.ValidationError({"showtime_id": "Showtime not found."})

        unique_seat_ids = list(dict.fromkeys(seat_ids))
        if len(unique_seat_ids) != len(seat_ids):
            raise serializers.ValidationError({"seat_ids": "Duplicate seat selections are not allowed."})

        seats = list(Seat.objects.filter(id__in=unique_seat_ids, screen=showtime.screen))
        if len(seats) != len(unique_seat_ids):
            raise serializers.ValidationError({"seat_ids": "One or more seats are invalid for this showtime."})

        booked = BookingSeat.objects.filter(showtime=showtime, seat_id__in=unique_seat_ids).exists()
        if booked:
            raise serializers.ValidationError({"seat_ids": "One or more seats are already booked."})

        attrs["showtime"] = showtime
        attrs["seats"] = seats
        return attrs


class BookingSeatDetailSerializer(serializers.ModelSerializer):
    seat_label = serializers.CharField(source="seat.label", read_only=True)

    class Meta:
        model = BookingSeat
        fields = ("seat_id", "seat_label")


class BookingDetailSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source="showtime.movie.title", read_only=True)
    theater_name = serializers.CharField(source="showtime.screen.theater.name", read_only=True)
    screen_name = serializers.CharField(source="showtime.screen.name", read_only=True)
    starts_at = serializers.DateTimeField(source="showtime.starts_at", read_only=True)
    price = serializers.DecimalField(source="showtime.price", max_digits=8, decimal_places=2, read_only=True)
    seats = BookingSeatDetailSerializer(source="booking_seats", many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = (
            "id",
            "status",
            "created_at",
            "movie_title",
            "theater_name",
            "screen_name",
            "starts_at",
            "price",
            "total_price",
            "seats",
        )

    def get_total_price(self, obj):
        seat_count = obj.booking_seats.count()
        return obj.showtime.price * seat_count
