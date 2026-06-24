from django.contrib import admin

from .models import Booking, BookingSeat, Showtime


class BookingSeatInline(admin.TabularInline):
    model = BookingSeat
    extra = 0
    readonly_fields = ("showtime", "seat")


@admin.register(Showtime)
class ShowtimeAdmin(admin.ModelAdmin):
    list_display = ("movie", "screen", "starts_at", "price")
    list_filter = ("screen__theater", "starts_at")
    search_fields = ("movie__title",)
    date_hierarchy = "starts_at"


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "showtime", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__email",)
    inlines = [BookingSeatInline]


@admin.register(BookingSeat)
class BookingSeatAdmin(admin.ModelAdmin):
    list_display = ("booking", "showtime", "seat")
