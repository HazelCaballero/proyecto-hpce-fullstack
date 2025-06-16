# Importación de las rutas necesarias de Django y JWT
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# Importación de las vistas personalizadas de la app
from .views import (
    CustomUserListCreateView, CustomUserDetailView,
    CategoriaListCreateView, CategoriaDetailView,
    TruequeListCreateView, TruequeDetailView,
    PublicacionListCreateView, PublicacionDetailView,
    InteraccionPublicacionListCreateView, InteraccionPublicacionDetailView,
    ServicioListCreateView, ServicioDetailView,
    InteraccionTruequeListCreateView, InteraccionTruequeDetailView,
    PublicidadesListCreateView, PublicidadesDetailView,
    ContactosListCreateView, ContactosDetailView,
    CrearSuperUsuario, VerSuperUsuario, ActualizarSuperUsuario, EliminarSuperUsuario, CustomTokenObtainPairView,
    AsignarRolUsuariaView
)


# Definición de rutas de la API
# Cada endpoint corresponde a un recurso CRUD o autenticación JWT.

urlpatterns = [
    # Rutas para usuarios personalizados
    path('usuarios/', CustomUserListCreateView.as_view(), name='usuarios-listar-crear'),
    path('usuarios/<int:pk>/', CustomUserDetailView.as_view(), name='usuarios-detalle'),

    # Rutas para categorías
    path('categorias/', CategoriaListCreateView.as_view(), name='categorias-listar-crear'),
    path('categorias/<int:pk>/', CategoriaDetailView.as_view(), name='categorias-detalle'),

    # Rutas para trueques
    path('trueques/', TruequeListCreateView.as_view(), name='trueques-listar-crear'),
    path('trueques/<int:pk>/', TruequeDetailView.as_view(), name='trueques-detalle'),

    # Rutas para publicaciones
    path('publicaciones/', PublicacionListCreateView.as_view(), name='publicaciones-listar-crear'),
    path('publicaciones/<int:pk>/', PublicacionDetailView.as_view(), name='publicaciones-detalle'),

    # Rutas para interacciones en publicaciones
    path('interacciones-publicacion/', InteraccionPublicacionListCreateView.as_view(), name='interacciones-publicacion-listar-crear'),
    path('interacciones-publicacion/<int:pk>/', InteraccionPublicacionDetailView.as_view(), name='interacciones-publicacion-detalle'),

    # Rutas para servicios
    path('servicios/', ServicioListCreateView.as_view(), name='servicios-listar-crear'),
    path('servicios/<int:pk>/', ServicioDetailView.as_view(), name='servicios-detalle'),

    # Rutas para interacciones en trueques
    path('interacciones-trueque/', InteraccionTruequeListCreateView.as_view(), name='interacciones-trueque-listar-crear'),
    path('interacciones-trueque/<int:pk>/', InteraccionTruequeDetailView.as_view(), name='interacciones-trueque-detalle'),

    # Rutas para publicidades
    path('publicidades/', PublicidadesListCreateView.as_view(), name='publicidades-listar-crear'),
    path('publicidades/<int:pk>/', PublicidadesDetailView.as_view(), name='publicidades-detalle'),

    # Rutas para contactos
    path('contactos/', ContactosListCreateView.as_view(), name='contactos-listar-crear'),
    path('contactos/<int:pk>/', ContactosDetailView.as_view(), name='contactos-detalle'),   
    
    # Rutas para administración de superusuarios
    path("crear-superusuario/", CrearSuperUsuario.as_view(), name="crear-superusuario"),
    path("ver-superusuario/", VerSuperUsuario.as_view(), name="ver-superusuario"),
    path("actualizar-superusuario/<int:pk>/", ActualizarSuperUsuario.as_view(), name="actualizar-superusuario"),
    path("eliminar-superusuario/<int:pk>/", EliminarSuperUsuario.as_view(), name="eliminar-superusuario"),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('asignar-rol-usuaria/<int:pk>/', AsignarRolUsuariaView.as_view(), name='asignar-rol-usuaria')
]
