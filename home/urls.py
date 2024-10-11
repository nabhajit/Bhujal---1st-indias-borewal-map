from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('',views.home,name="home"),
    path('login/',views.login,name="login"),
    path('signup/',views.signup,name="register"),
    path('main/<str:cid>/',views.main,name="main"),
    path('borewellRegister/',views.borewellRegister,name="borewellRegister"),
    path('api/get_borewells/', views.get_borewells, name='get_borewells'),
    path('api/get_borewell_owners/', views.get_borewell_owners, name='get_borewell_owners'),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)