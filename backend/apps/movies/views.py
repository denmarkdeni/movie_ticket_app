from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Movie
from .serializers import MovieDetailSerializer, MovieListSerializer


class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieListSerializer
    permission_classes = [AllowAny]


class MovieDetailView(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieDetailSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["upcoming_showtimes"] = True
        return context

    def get_object(self):
        movie = super().get_object()
        movie.filtered_showtimes = movie.showtimes.filter(starts_at__gte=timezone.now()).select_related(
            "screen__theater"
        )
        return movie
