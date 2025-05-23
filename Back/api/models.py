# aun no hago migraciones
# investigar tablas de django base porque para reeditar antes de hacer migraciones

from django.db import models
import datetime
from django.contrib.auth.models import User
class Usuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    telefono = models.CharField(max_length=20, null=True, blank=True)

class AuthGroup(models.Model):
    nombre = models.CharField(
        max_length=15,
        unique=True,
        null=False,
        blank=False,
        help_text="Nombre único del rol (mínimo 3 caracteres)"
    )

    def clean(self):
        if len(self.nombre) < 3:
            raise Exception("El nombre del rol debe tener al menos 3 caracteres.")

    def __str__(self):
        return self.nombre

class AuthUser(models.Model):
    nombre = models.CharField(
        max_length=80,
        null=False,
        blank=False,
        help_text="Nombre de usuaria"
    )
    correo = models.EmailField(
        max_length=200,
        unique=True,
        null=False,
        blank=False,
        help_text="Correo electrónico único"
    )
    contraseña = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        help_text="Contraseña (mínimo 8 caracteres)"
    )
    fecha_nacimiento = models.DateField(
        null=False,
        blank=False,
        help_text="Fecha de nacimiento"
    )
    intereses = models.TextField(
        null=False,
        blank=False,
        help_text="Intereses de la usuaria"
    )
    id_auth_group = models.ForeignKey(
        AuthGroup, on_delete=models.SET_NULL, null=False, blank=False
    )
    aportaciones = models.TextField(
        null=False,
        blank=False,
        help_text="Aportaciones de la usuaria"
    )
    telefono = models.CharField(
        max_length=20,
        null=False,
        blank=False,
        help_text="Teléfono en formato internacional (ej: +50681234567)"
    )
    ubicacion = models.CharField(
        max_length=200,
        null=False,
        blank=False,
        help_text="Ubicación del usuario"
    )
    imagen_url = models.TextField(
        null=False,
        blank=False,
        help_text="URL de la imagen de perfil"
    )

    def clean(self):
        if len(self.nombre) < 3:
            raise Exception("El nombre debe tener al menos 3 caracteres.")
        if len(self.contraseña) < 8:
            raise Exception("La contraseña debe tener al menos 8 caracteres.")
        if self.fecha_nacimiento > datetime.date.today():
            raise Exception("La fecha de nacimiento no puede ser en el futuro.")
        if self.telefono and (not self.telefono.replace("+", "").isdigit() or not (7 <= len(self.telefono.replace("+", "")) <= 15)):
            raise Exception("Número de teléfono inválido.")
        if "@" not in self.correo or "." not in self.correo:
            raise Exception("Correo electrónico inválido.")

    def __str__(self):
        return self.nombre

class AuthUserGroups(models.Model):
    id_auth_group = models.ForeignKey(AuthGroup, on_delete=models.CASCADE, null=False, blank=False)
    id_auth_user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, null=False, blank=False)

    class Meta:
        unique_together = ('id_auth_group', 'id_auth_user')

class Categoria(models.Model):
    nombre = models.CharField(
        max_length=25,
        unique=True,
        null=False,
        blank=False,
        help_text="Nombre único de la categoría"
    )

    def clean(self):
        if len(self.nombre) < 4:
            raise Exception("El nombre de la categoría debe tener al menos 4 caracteres.")

    def __str__(self):
        return self.nombre

class Trueque(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aceptado', 'Aceptado'),
        ('cancelado', 'Cancelado'),
    ]
    titulo = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        help_text="Título del trueque (mínimo 3 caracteres)"
    )
    trueque = models.TextField(null=False, blank=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    id_auth_user = models.ForeignKey(AuthUser, on_delete=models.SET_NULL, null=False, blank=False)
    estado = models.CharField(
        max_length=10,
        choices=ESTADO_CHOICES,
        default='pendiente',
        null=False,
        blank=False
    )
    categoria = models.CharField(max_length=50, null=False, blank=False)
    ubicacion = models.CharField(max_length=100, null=False, blank=False)
    imagen_url = models.TextField(null=True, blank=True)

    def clean(self):
        if len(self.titulo) < 3:
            raise Exception("El título debe tener al menos 3 caracteres.")

class Publicacion(models.Model):
    titulo = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        help_text="Título de la publicación (mínimo 3 caracteres)"
    )
    publicacion = models.TextField(null=False, blank=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    id_auth_user = models.ForeignKey(AuthUser, on_delete=models.SET_NULL, null=False, blank=False)
    imagen_url = models.TextField(null=True, blank=True)

    def clean(self):
        if len(self.titulo) < 3:
            raise Exception("El título debe tener al menos 3 caracteres.")

class ComentarioPublicacion(models.Model):
    id_publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, null=False, blank=False)
    id_auth_user = models.ForeignKey(AuthUser, on_delete=models.SET_NULL, null=False, blank=False)
    comentario = models.TextField(null=False, blank=False)
    me_gusta = models.BooleanField(default=False, null=True, blank=True)

    def clean(self):
        if len(self.comentario.strip()) < 1:
            raise Exception("El comentario no puede estar vacío.")

class Servicio(models.Model):
    producto = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        help_text="Nombre del producto (mínimo 2 caracteres)"
    )
    contenido = models.TextField(null=False, blank=False)
    fecha_inicio = models.DateTimeField(null=False, blank=False)
    fecha_fin = models.DateTimeField(null=False, blank=False)
    precio_servicio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=False,
        blank=False
    )
    id_auth_user = models.ForeignKey(AuthUser, on_delete=models.SET_NULL, null=False, blank=False)

    def clean(self):
        if len(self.producto) < 2:
            raise Exception("El producto debe tener al menos 2 caracteres.")
        if self.precio_servicio < 0:
            raise Exception("El precio no puede ser negativo.")

class InteracionTrueque(models.Model):
    id_trueque = models.ForeignKey(Trueque, on_delete=models.CASCADE, null=False, blank=False)
    id_auth_user = models.ForeignKey(AuthUser, on_delete=models.SET_NULL, null=False, blank=False)
    comentario = models.TextField(null=False, blank=False)
    me_interesa = models.BooleanField(default=False, null=True, blank=True)

class Publicidades(models.Model):
    ESTADO_CHOICES = [
        ('activada', 'Activada'),
        ('desactivada', 'Desactivada'),
    ]
    precio_publicidad = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=False,
        blank=False
    )
    id_auth_user = models.ForeignKey(AuthUser, on_delete=models.SET_NULL, null=False, blank=False)
    estado = models.CharField(
        choices=ESTADO_CHOICES,
        default='desactivada',
        null=False,
        blank=False
    )
    id_servicio = models.ForeignKey(Servicio, on_delete=models.SET_NULL, null=False, blank=False)

    def clean(self):
        if self.precio_publicidad < 0:
            raise Exception("El precio de la publicidad no puede ser negativo.")

class Contactos(models.Model):
    id_auth_user = models.ForeignKey(AuthUser, on_delete=models.SET_NULL, null=False, blank=False)
    correo = models.EmailField(
        max_length=200,
        unique=True,
        null=False,
        blank=False
    )
    promocionarse = models.BooleanField(null=True, blank=True, default=False)
    mensaje = models.TextField(null=False, blank=False)
    fecha_envio = models.DateTimeField(auto_now_add=True, null=False, blank=False)

    def clean(self):
        if len(self.mensaje.strip()) < 1:
            raise Exception("El mensaje no puede estar vacío.")
        if "@" not in self.correo or "." not in self.correo:
            raise Exception("Correo electrónico inválido.")
