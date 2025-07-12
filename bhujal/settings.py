from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
SECRET_KEY = 'django-insecure-@j@5&_qx3pg*c42tx3xt^3uu&%$t=fag95isy0@+vh2$42_$%^'
DEBUG = True

ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1', '.vercel.app', '.now.sh', 'www.bhujal.tech', 'bhujal.tech']

# Application definition
INSTALLED_APPS = [
    'whitenoise.runserver_nostatic',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'home',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'home.middleware.AuthenticationMiddleware',
]

ROOT_URLCONF = 'bhujal.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'bhujal.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'  # URL for static files
MEDIA_URL = '/media/'  # URL for media files

# Set STATIC_ROOT for production use
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Ensure this is defined

if DEBUG:
    STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]  # Local static files during development

# This is where media files (uploaded by users) are stored
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Enable automatic file compression and caching with WhiteNoise
WHITENOISE_AUTOREFRESH = False  # Turn this off for production
WHITENOISE_USE_FINDERS = True  # Enable if you're using staticfiles finders

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STORAGES = {
    # ...
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': DEBUG and "DEBUG" or "ERROR",  # Adjust logging level based on DEBUG setting
        },
    },
}

# Add these session settings
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = 86400  # 24 hours in seconds
SESSION_COOKIE_SECURE = True  # Use only with HTTPS
SESSION_COOKIE_HTTPONLY = True