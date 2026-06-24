"""
Production Django settings — import base settings and override for Render deployment.
Set DJANGO_SETTINGS_MODULE=config.settings_production on the web service.
"""
import os

import dj_database_url

from .settings import *  # noqa: F403, F401

DEBUG = False

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY must be set in production")

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL must be set in production")

DATABASES = {
    "default": dj_database_url.parse(DATABASE_URL, conn_max_age=600),  # noqa: F405
}

ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get("ALLOWED_HOSTS", "").split(",")
    if h.strip()
]
if not ALLOWED_HOSTS:
    ALLOWED_HOSTS = [".onrender.com"]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
