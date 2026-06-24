from rest_framework import serializers
from django.utils import timezone
from apps.bookings.models import Showtime

from .models import Movie

class ShowtimeSummarySerializer(serializers.ModelSerializer):
    theater_name = serializers.CharField(source="screen.theater.name", read_only=True)
    screen_name = serializers.CharField(source="screen.name", read_only=True)

    class Meta:
        model = Showtime
        fields = ("id", "starts_at", "price", "theater_name", "screen_name")


class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ("id", "title", "poster_url", "duration_minutes", "synopsis")


# class MovieDetailSerializer(serializers.ModelSerializer):
#     showtimes = ShowtimeSummarySerializer(many=True, read_only=True)

#     class Meta:
#         model = Movie
#         fields = ("id", "title", "poster_url", "duration_minutes", "synopsis", "showtimes")
class MovieDetailSerializer(serializers.ModelSerializer):
    showtimes = serializers.SerializerMethodField()

    def get_showtimes(self, obj):
        qs = getattr(obj, 'filtered_showtimes', obj.showtimes.filter(starts_at__gte=timezone.now()))
        return ShowtimeSummarySerializer(qs, many=True).data

    class Meta:
        model = Movie
        fields = ("id", "title", "poster_url", "duration_minutes", "synopsis", "showtimes")