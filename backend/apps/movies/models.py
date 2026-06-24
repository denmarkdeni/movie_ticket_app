from django.db import models


class Movie(models.Model):
    title = models.CharField(max_length=255)
    poster_url = models.URLField(blank=True)
    duration_minutes = models.PositiveIntegerField()
    synopsis = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title
