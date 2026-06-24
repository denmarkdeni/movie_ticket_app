from django.db import models


class Theater(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=100)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Screen(models.Model):
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name="screens")
    name = models.CharField(max_length=100)
    rows = models.PositiveIntegerField()
    seats_per_row = models.PositiveIntegerField()

    class Meta:
        ordering = ["theater", "name"]
        unique_together = [["theater", "name"]]

    def __str__(self):
        return f"{self.theater.name} — {self.name}"


class Seat(models.Model):
    screen = models.ForeignKey(Screen, on_delete=models.CASCADE, related_name="seats")
    row = models.PositiveIntegerField()
    number = models.PositiveIntegerField()
    label = models.CharField(max_length=10)

    class Meta:
        ordering = ["screen", "row", "number"]
        unique_together = [["screen", "row", "number"]]

    def __str__(self):
        return f"{self.screen} — {self.label}"
