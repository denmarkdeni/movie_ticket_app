from datetime import datetime, timedelta
from decimal import Decimal

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.bookings.models import Showtime
from apps.movies.models import Movie
from apps.theaters.models import Screen, Seat, Theater


MOVIES = [
    {
        "title": "Neon Horizon",
        "poster_url": "https://placehold.co/300x450/1a1a2e/e94560?text=Neon+Horizon",
        "duration_minutes": 128,
        "synopsis": "In a rain-soaked megacity, a detective uncovers a conspiracy that blurs the line between memory and machine.",
    },
    {
        "title": "The Last Orchard",
        "poster_url": "https://placehold.co/300x450/2d6a4f/95d5b2?text=Last+Orchard",
        "duration_minutes": 104,
        "synopsis": "Three siblings return to their family farm and must decide whether to sell the last orchard in the valley.",
    },
    {
        "title": "Starlight Express",
        "poster_url": "https://placehold.co/300x450/023e8a/90e0ef?text=Starlight+Express",
        "duration_minutes": 112,
        "synopsis": "A retired astronaut is pulled back for one final mission when a rogue satellite threatens global communications.",
    },
    {
        "title": "Midnight Comedy Club",
        "poster_url": "https://placehold.co/300x450/6a040f/f48c06?text=Midnight+Comedy",
        "duration_minutes": 98,
        "synopsis": "An aspiring comedian navigates late-night gigs, awkward romances, and a rival who steals every punchline.",
    },
    {
        "title": "Echoes of Winter",
        "poster_url": "https://placehold.co/300x450/495057/adb5bd?text=Echoes+of+Winter",
        "duration_minutes": 136,
        "synopsis": "Two estranged friends reunite at a remote cabin when a blizzard traps them with secrets from their past.",
    },
    {
        "title": "Velocity",
        "poster_url": "https://placehold.co/300x450/212529/f8f9fa?text=Velocity",
        "duration_minutes": 118,
        "synopsis": "Street racers and corporate spies collide in a high-stakes chase across three continents.",
    },
]

THEATERS = [
    {
        "name": "Grand Plaza Cinema",
        "address": "100 Main Street",
        "screens": [
            {"name": "Screen 1", "rows": 6, "seats_per_row": 8},
            {"name": "Screen 2", "rows": 5, "seats_per_row": 10},
        ],
    },
    {
        "name": "Riverside Multiplex",
        "address": "42 River Road",
        "screens": [
            {"name": "Auditorium A", "rows": 8, "seats_per_row": 10},
        ],
    },
    {
        "name": "Downtown Arts Theater",
        "address": "7 Center Avenue",
        "screens": [
            {"name": "Main Hall", "rows": 7, "seats_per_row": 9},
        ],
    },
]

SHOWTIME_HOURS = [11, 14, 17, 20]


def row_label(row_index):
    return chr(ord("A") + row_index - 1)


class Command(BaseCommand):
    help = "Seed sample theaters, movies, and showtimes for the configured city."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete existing seed-related data before seeding.",
        )

    def handle(self, *args, **options):
        city = settings.CITY_NAME

        if options["clear"]:
            Showtime.objects.all().delete()
            Movie.objects.all().delete()
            Seat.objects.all().delete()
            Screen.objects.all().delete()
            Theater.objects.all().delete()
            self.stdout.write(self.style.WARNING("Cleared existing theaters, movies, and showtimes."))

        theaters = []
        for theater_data in THEATERS:
            theater, _ = Theater.objects.get_or_create(
                name=theater_data["name"],
                defaults={
                    "address": theater_data["address"],
                    "city": city,
                },
            )
            theaters.append(theater)

            for screen_data in theater_data["screens"]:
                screen, created = Screen.objects.get_or_create(
                    theater=theater,
                    name=screen_data["name"],
                    defaults={
                        "rows": screen_data["rows"],
                        "seats_per_row": screen_data["seats_per_row"],
                    },
                )
                if created:
                    seats = []
                    for row in range(1, screen.rows + 1):
                        for number in range(1, screen.seats_per_row + 1):
                            label = f"{row_label(row)}{number}"
                            seats.append(
                                Seat(
                                    screen=screen,
                                    row=row,
                                    number=number,
                                    label=label,
                                )
                            )
                    Seat.objects.bulk_create(seats)

        movies = []
        for movie_data in MOVIES:
            movie, _ = Movie.objects.get_or_create(
                title=movie_data["title"],
                defaults=movie_data,
            )
            movies.append(movie)

        screens = list(Screen.objects.select_related("theater"))
        now = timezone.now()
        showtime_count = 0

        for day_offset in range(7):
            day = now.date() + timedelta(days=day_offset)
            for hour in SHOWTIME_HOURS:
                starts_at = timezone.make_aware(
                    datetime.combine(day, datetime.min.time()).replace(hour=hour)
                )
                if starts_at <= now:
                    continue

                for index, movie in enumerate(movies):
                    screen = screens[(day_offset + hour + index) % len(screens)]
                    price = Decimal("12.00") + Decimal(str(index % 3)) * Decimal("2.50")
                    _, created = Showtime.objects.get_or_create(
                        movie=movie,
                        screen=screen,
                        starts_at=starts_at,
                        defaults={"price": price},
                    )
                    if created:
                        showtime_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(theaters)} theaters, {len(movies)} movies, "
                f"and {showtime_count} new showtimes in {city}."
            )
        )
