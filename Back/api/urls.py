# Definición de rutas de la API
# Cada endpoint corresponde a un recurso CRUD o autenticación JWT.

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
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

urlpatterns = [
    # Rutas para usuarios personalizados
    path('usuarios/', CustomUserListCreateView.as_view(), name='usuarios-listar-crear'),  # Listar y crear usuarios
    path('usuarios/<int:pk>/', CustomUserDetailView.as_view(), name='usuarios-detalle'),  # Detalle de usuario

    # Rutas para categorías
    path('categorias/', CategoriaListCreateView.as_view(), name='categorias-listar-crear'),  # Listar y crear categorías
    path('categorias/<int:pk>/', CategoriaDetailView.as_view(), name='categorias-detalle'),  # Detalle de categoría

    # Rutas para trueques
    path('trueques/', TruequeListCreateView.as_view(), name='trueques-listar-crear'),  # Listar y crear trueques
    path('trueques/<int:pk>/', TruequeDetailView.as_view(), name='trueques-detalle'),  # Detalle de trueque

    # Rutas para publicaciones
    path('publicaciones/', PublicacionListCreateView.as_view(), name='publicaciones-listar-crear'),  # Listar y crear publicaciones
    path('publicaciones/<int:pk>/', PublicacionDetailView.as_view(), name='publicaciones-detalle'),  # Detalle de publicación

    # Rutas para interacciones en publicaciones
    path('interacciones-publicacion/', InteraccionPublicacionListCreateView.as_view(), name='interacciones-publicacion-listar-crear'),  # Listar y crear interacciones en publicaciones
    path('interacciones-publicacion/<int:pk>/', InteraccionPublicacionDetailView.as_view(), name='interacciones-publicacion-detalle'),  # Detalle de interacción en publicación

    # Rutas para servicios
    path('servicios/', ServicioListCreateView.as_view(), name='servicios-listar-crear'),  # Listar y crear servicios
    path('servicios/<int:pk>/', ServicioDetailView.as_view(), name='servicios-detalle'),  # Detalle de servicio

    # Rutas para interacciones en trueques
    path('interacciones-trueque/', InteraccionTruequeListCreateView.as_view(), name='interacciones-trueque-listar-crear'),  # Listar y crear interacciones en trueques
    path('interacciones-trueque/<int:pk>/', InteraccionTruequeDetailView.as_view(), name='interacciones-trueque-detalle'),  # Detalle de interacción en trueque

    # Rutas para publicidades
    path('publicidades/', PublicidadesListCreateView.as_view(), name='publicidades-listar-crear'),  # Listar y crear publicidades
    path('publicidades/<int:pk>/', PublicidadesDetailView.as_view(), name='publicidades-detalle'),  # Detalle de publicidad

    # Rutas para contactos
    path('contactos/', ContactosListCreateView.as_view(), name='contactos-listar-crear'),  # Listar y crear contactos
    path('contactos/<int:pk>/', ContactosDetailView.as_view(), name='contactos-detalle'),   # Detalle de contacto

    # Rutas para administración de superusuarios
    path("crear-superusuario/", CrearSuperUsuario.as_view(), name="crear-superusuario"),  # Crear superusuario
    path("ver-superusuario/", VerSuperUsuario.as_view(), name="ver-superusuario"),  # Ver superusuarios
    path("actualizar-superusuario/<int:pk>/", ActualizarSuperUsuario.as_view(), name="actualizar-superusuario"),  # Actualizar superusuario
    path("eliminar-superusuario/<int:pk>/", EliminarSuperUsuario.as_view(), name="eliminar-superusuario"),  # Eliminar superusuario
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Obtener token JWT
    path('asignar-rol-usuaria/<int:pk>/', AsignarRolUsuariaView.as_view(), name='asignar-rol-usuaria')  # Asignar rol a usuaria
]
