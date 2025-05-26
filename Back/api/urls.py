from django.urls import path
from .views import (
    CustomUserListCreateView, CustomUserDetailView,
    CategoriaListCreateView, CategoriaDetailView,
    TruequeListCreateView, TruequeDetailView,
    PublicacionListCreateView, PublicacionDetailView,
    InteraccionPublicacionListCreateView, InteraccionPublicacionDetailView,
    ServicioListCreateView, ServicioDetailView,
    InteraccionTruequeListCreateView, InteraccionTruequeDetailView,
    PublicidadesListCreateView, PublicidadesDetailView,
    ContactosListCreateView, ContactosDetailView
)

urlpatterns = [
    path('usuarios/', CustomUserListCreateView.as_view(), name='usuarios-listar-crear'),
    path('usuarios/<int:pk>/', CustomUserDetailView.as_view(), name='usuarios-detalle'),

    path('categorias/', CategoriaListCreateView.as_view(), name='categorias-listar-crear'),
    path('categorias/<int:pk>/', CategoriaDetailView.as_view(), name='categorias-detalle'),

    path('trueques/', TruequeListCreateView.as_view(), name='trueques-listar-crear'),
    path('trueques/<int:pk>/', TruequeDetailView.as_view(), name='trueques-detalle'),

#hice pruebas en postman hasta aca
    path('publicaciones/', PublicacionListCreateView.as_view(), name='publicaciones-listar-crear'),
    path('publicaciones/<int:pk>/', PublicacionDetailView.as_view(), name='publicaciones-detalle'),

    path('interacciones-publicacion/', InteraccionPublicacionListCreateView.as_view(), name='interacciones-publicacion-listar-crear'),
    path('interacciones-publicacion/<int:pk>/', InteraccionPublicacionDetailView.as_view(), name='interacciones-publicacion-detalle'),

    path('servicios/', ServicioListCreateView.as_view(), name='servicios-listar-crear'),
    path('servicios/<int:pk>/', ServicioDetailView.as_view(), name='servicios-detalle'),

    path('interacciones-trueque/', InteraccionTruequeListCreateView.as_view(), name='interacciones-trueque-listar-crear'),
    path('interacciones-trueque/<int:pk>/', InteraccionTruequeDetailView.as_view(), name='interacciones-trueque-detalle'),

    path('publicidades/', PublicidadesListCreateView.as_view(), name='publicidades-listar-crear'),
    path('publicidades/<int:pk>/', PublicidadesDetailView.as_view(), name='publicidades-detalle'),

    path('contactos/', ContactosListCreateView.as_view(), name='contactos-listar-crear'),
    path('contactos/<int:pk>/', ContactosDetailView.as_view(), name='contactos-detalle'),
]