from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('home.urls')),
]

# # Serve media files in development
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
#     # Serve static files in development
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# else:
#     # Optionally, you can add a fallback for production if needed (not recommended for serving static files)
#     urlpatterns += [
#         re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
#     ]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)