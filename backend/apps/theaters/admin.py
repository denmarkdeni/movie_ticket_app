from django.contrib import admin

from .models import Screen, Seat, Theater


class ScreenInline(admin.TabularInline):
    model = Screen
    extra = 0


@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "address")
    search_fields = ("name", "city")
    inlines = [ScreenInline]


class SeatInline(admin.TabularInline):
    model = Seat
    extra = 0


@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    list_display = ("name", "theater", "rows", "seats_per_row")
    list_filter = ("theater",)
    inlines = [SeatInline]


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ("label", "screen", "row", "number")
    list_filter = ("screen__theater",)
