from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta


# Modelos de la aplicación

# Usuario personalizado extendiendo AbstractUser
class CustomUser(AbstractUser):
    """
    Modelo de usuario personalizado que extiende AbstractUser.
    Incluye campos adicionales como teléfono, fecha de nacimiento, intereses, aportaciones, ubicación, imagen y rol.
    """
    telefono = models.CharField(max_length=20, null=False, blank=False, default='00000000')
    fecha_nacimiento = models.DateField(null=False, blank=False, default='1990-01-01')
    intereses = models.TextField(null=False, blank=False, default='N/A')
    aportaciones = models.TextField(null=False, blank=False, default='N/A')
    ubicacion = models.CharField(max_length=80, null=False, blank=False, default='N/A')
    imagen_url = models.TextField(null=True, blank=True, default='')
    
    ROL_CHOICES = [
        ('usuaria', 'Usuaria'),
        ('moderador', 'Moderador'),
        ('soporte', 'Soporte'),
        ('superusuario', 'Superusuario'),
    ]
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='usuaria')

    def clean(self):
        """
        Validaciones personalizadas para el modelo de usuario.
        """
        if len(self.username) < 3:
            raise Exception("El nombre de usuario debe tener al menos 3 caracteres.")
        if self.fecha_nacimiento and self.fecha_nacimiento > timezone.now().date():
             raise Exception("La fecha de nacimiento no puede ser en el futuro.")
        if self.telefono and (not self.telefono.replace("+", "").isdigit() or not (7 <= len(self.telefono.replace("+", "")) <= 15)):
            raise Exception("Número de teléfono inválido.")
        if self.email and ("@" not in self.email or "." not in self.email):
            raise Exception("Correo electrónico inválido.")

    def __str__(self):
        return self.username

# Modelo para categorías de trueques o publicaciones
class Categoria(models.Model):
    """
    Modelo para representar categorías de trueques o publicaciones.
    """
    nombre = models.CharField(
        max_length=25,
        unique=True,
        null=False,
        blank=False,
        help_text="Nombre único de la categoría"
    )

    # Validación personalizada para el nombre de la categoría
    def clean(self):
        if len(self.nombre) < 4:
            raise Exception("El nombre de la categoría debe tener al menos 4 caracteres.")

    def __str__(self):
        return self.nombre

# Modelo para los trueques
class Trueque(models.Model):
    """
    Modelo para representar trueques entre usuarios.
    Incluye información sobre el título, descripción, fechas, usuario involucrado, estado y categoría del trueque.
    """
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aceptado', 'Aceptado'),
        ('cancelado', 'Cancelado'),
    ]
    titulo = models.CharField(max_length=100)
    trueque = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='pendiente', db_index=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, db_index=True)
    ubicacion = models.CharField(max_length=80)
    imagen_url = models.TextField(null=True, blank=True)

    # Validación personalizada para el título
    def clean(self):
        if len(self.titulo) < 3:
            raise Exception("El título debe tener al menos 3 caracteres.")

# Modelo para publicaciones generales
class Publicacion(models.Model):
    """
    Modelo para representar publicaciones generales de los usuarios.
    Incluye campos para el título, contenido, fecha de creación, usuario autor e imagen.
    """
    titulo = models.CharField(max_length=50)
    publicacion = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    imagen_url = models.TextField(null=True, blank=True)

    # Validación personalizada para el título
    def clean(self):
        if len(self.titulo) < 3:
            raise Exception("El título debe tener al menos 3 caracteres.")

# Modelo para interacciones en publicaciones (comentarios y me gusta)
class InteraccionPublicacion(models.Model):
    """
    Modelo para representar interacciones de los usuarios en las publicaciones.
    Incluye campos para el comentario, me gusta y referencias a la publicación y usuario.
    """
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comentario = models.TextField()
    me_gusta = models.BooleanField(default=False)

    # Validación para que el comentario no esté vacío
    def clean(self):
        if len(self.comentario.strip()) < 1:
            raise Exception("El comentario no puede estar vacío.")

# Modelo para servicios ofrecidos
class Servicio(models.Model):
    """
    Modelo para representar los servicios ofrecidos por los usuarios.
    Incluye información sobre el producto, contenido, precio del producto, monto pagado, días de anuncio (calculado), precio de la publicidad y usuario oferente.
    """
    producto = models.CharField(max_length=100)
    contenido = models.TextField()
    precio_producto = models.DecimalField(max_digits=10, decimal_places=2)
    monto_pagado = models.DecimalField(max_digits=10, decimal_places=2)
    dias_anuncio = models.PositiveIntegerField(editable=False)
    precio_publicidad = models.DecimalField(max_digits=10, decimal_places=2, default=250, editable=False)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.precio_publicidad = 250
        self.dias_anuncio = int(self.monto_pagado // self.precio_publicidad) if self.precio_publicidad > 0 else 0
        super().save(*args, **kwargs)

    # Validaciones para el producto y los precios
    def clean(self):
        if len(self.producto) < 2:
            raise Exception("El producto debe tener al menos 2 caracteres.")
        if self.precio_producto < 0:
            raise Exception("El precio del producto no puede ser negativo.")
        if self.monto_pagado < 0:
            raise Exception("El monto pagado no puede ser negativo.")

# Modelo para interacciones en trueques (comentarios y me interesa)
class InteraccionTrueque(models.Model):
    """
    Modelo para representar interacciones de los usuarios en los trueques.
    Incluye campos para el comentario, me interesa y referencias al trueque y usuario.
    """
    trueque = models.ForeignKey(Trueque, on_delete=models.CASCADE)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comentario = models.TextField()
    me_interesa = models.BooleanField(default=False)

# Modelo para publicidades de servicios
class Publicidades(models.Model):
    """
    Modelo para gestionar la publicidad de servicios ofrecidos por los usuarios.
    Incluye campos para el precio, estado, usuario propietario, servicio asociado y fechas de publicación.
    """
    ESTADO_CHOICES = [
        ('activada', 'Activada'),
        ('desactivada', 'Desactivada'),
    ]
    precio_publicidad = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    estado = models.CharField(max_length=50, choices=ESTADO_CHOICES, default='desactivada')
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    fecha_inicio = models.DateTimeField(editable=False)
    fecha_fin = models.DateTimeField(null=True, blank=True, editable=False)

    def save(self, *args, **kwargs):
        # Asignar fecha de inicio automáticamente si no existe
        if not self.fecha_inicio:
            self.fecha_inicio = timezone.now()
        # Calcular fecha de fin automáticamente
        if self.servicio and self.servicio.dias_anuncio:
            self.fecha_fin = self.fecha_inicio + timedelta(days=self.servicio.dias_anuncio)
        super().save(*args, **kwargs)

    # Validación para el precio de la publicidad
    def clean(self):
        if self.precio_publicidad < 0:
            raise Exception("El precio de la publicidad no puede ser negativo.")

# Modelo para contactos (mensajes de usuarios)
class Contactos(models.Model):
    """
    Modelo para representar los mensajes de contacto enviados por los usuarios.
    Incluye campos para el usuario remitente, correo, opción de promocionarse, mensaje y fecha de envío.
    """
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    correo = models.EmailField(max_length=50)
    promocionarse = models.BooleanField(default=False)
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False)  # Nuevo campo para marcar si el mensaje fue leído

    # Validaciones para el mensaje y el correo
    def clean(self):
        if len(self.mensaje.strip()) < 1:
            raise Exception("El mensaje no puede estar vacío.")
        if "@" not in self.correo or "." not in self.correo:
            raise Exception("Correo electrónico inválido.")