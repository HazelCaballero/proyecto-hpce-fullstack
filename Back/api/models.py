from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta


# Modelos de la aplicación

class CustomUser(AbstractUser):
    """
    Modelo de usuario personalizado que extiende AbstractUser.
    Incluye campos adicionales como teléfono, fecha de nacimiento, intereses, aportaciones, ubicación, imagen y rol.
    """
    telefono = models.CharField(max_length=20, null=False, blank=False, default='00000000')  # Teléfono del usuario
    fecha_nacimiento = models.DateField(null=False, blank=False, default='1990-01-01')  # Fecha de nacimiento
    intereses = models.TextField(null=False, blank=False, default='N/A')  # Intereses del usuario
    aportaciones = models.TextField(null=False, blank=False, default='N/A')  # Aportaciones del usuario
    ubicacion = models.CharField(max_length=80, null=False, blank=False, default='N/A')  # Ubicación
    imagen_url = models.TextField(null=True, blank=True, default='')  # URL de la imagen de perfil

    # Definición de roles posibles
    ROL_CHOICES = [
        ('usuaria', 'Usuaria'),
        ('moderador', 'Moderador'),
        ('soporte', 'Soporte'),
        ('superusuario', 'Superusuario'),
    ]
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='usuaria')  # Rol del usuario

    def clean(self):
        """
        Realiza validaciones personalizadas para el modelo de usuario.
        - El nombre de usuario debe tener al menos 3 caracteres.
        - La fecha de nacimiento no puede ser en el futuro.
        - El teléfono debe ser válido.
        - El correo electrónico debe tener formato válido.
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
        """
        Retorna el nombre de usuario como representación del objeto.
        """
        return self.username


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
    )  # Nombre único de la categoría

    def clean(self):
        """
        Valida que el nombre de la categoría tenga al menos 4 caracteres.
        """
        if len(self.nombre) < 4:
            raise Exception("El nombre de la categoría debe tener al menos 4 caracteres.")

    def __str__(self):
        """
        Retorna el nombre de la categoría como representación del objeto.
        """
        return self.nombre


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
    titulo = models.CharField(max_length=100)  # Título del trueque
    trueque = models.TextField()  # Descripción del trueque
    fecha_creacion = models.DateTimeField(auto_now_add=True)  # Fecha de creación
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Usuario que crea el trueque
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='pendiente', db_index=True)  # Estado
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, db_index=True)  # Categoría
    ubicacion = models.CharField(max_length=80)  # Ubicación
    imagen_url = models.TextField(null=True, blank=True)  # Imagen asociada

    def clean(self):
        """
        Valida que el título tenga al menos 3 caracteres.
        """
        if len(self.titulo) < 3:
            raise Exception("El título debe tener al menos 3 caracteres.")


class Publicacion(models.Model):
    """
    Modelo para representar publicaciones generales de los usuarios.
    Incluye campos para el título, contenido, fecha de creación, usuario autor e imagen.
    """
    titulo = models.CharField(max_length=50)  # Título de la publicación
    publicacion = models.TextField()  # Contenido de la publicación
    fecha_creacion = models.DateTimeField(auto_now_add=True)  # Fecha de creación
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Usuario autor
    imagen_url = models.TextField(null=True, blank=True)  # Imagen asociada

    def clean(self):
        """
        Valida que el título tenga al menos 3 caracteres.
        """
        if len(self.titulo) < 3:
            raise Exception("El título debe tener al menos 3 caracteres.")


class InteraccionPublicacion(models.Model):
    """
    Modelo para representar interacciones de los usuarios en las publicaciones.
    Incluye campos para el comentario, me gusta y referencias a la publicación y usuario.
    """
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE)  # Publicación relacionada
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Usuario que interactúa
    comentario = models.TextField()  # Comentario
    me_gusta = models.BooleanField(default=False)  # Indica si es un "me gusta"

    def clean(self):
        """
        Valida que el comentario no esté vacío.
        """
        if len(self.comentario.strip()) < 1:
            raise Exception("El comentario no puede estar vacío.")


class Servicio(models.Model):
    """
    Modelo para representar los servicios ofrecidos por los usuarios.
    Incluye información sobre el producto, contenido, precio del producto, monto pagado, días de anuncio (calculado), precio de la publicidad y usuario oferente.
    """
    producto = models.CharField(max_length=100)  # Nombre del producto o servicio
    contenido = models.TextField()  # Descripción
    precio_producto = models.DecimalField(max_digits=10, decimal_places=2)  # Precio
    monto_pagado = models.DecimalField(max_digits=10, decimal_places=2)  # Monto pagado
    dias_anuncio = models.PositiveIntegerField(editable=False)  # Días de anuncio (calculado)
    precio_publicidad = models.DecimalField(max_digits=10, decimal_places=2, default=250, editable=False)  # Precio fijo de publicidad
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Usuario oferente

    def save(self, *args, **kwargs):
        """
        Calcula los días de anuncio en base al monto pagado y guarda el servicio.
        """
        self.precio_publicidad = 250
        self.dias_anuncio = int(self.monto_pagado // self.precio_publicidad) if self.precio_publicidad > 0 else 0
        super().save(*args, **kwargs)

    def clean(self):
        """
        Valida que el producto tenga al menos 2 caracteres y que los precios no sean negativos.
        """
        if len(self.producto) < 2:
            raise Exception("El producto debe tener al menos 2 caracteres.")
        if self.precio_producto < 0:
            raise Exception("El precio del producto no puede ser negativo.")
        if self.monto_pagado < 0:
            raise Exception("El monto pagado no puede ser negativo.")


class InteraccionTrueque(models.Model):
    """
    Modelo para representar interacciones de los usuarios en los trueques.
    Incluye campos para el comentario, me interesa y referencias al trueque y usuario.
    """
    trueque = models.ForeignKey(Trueque, on_delete=models.CASCADE)  # Trueque relacionado
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Usuario que interactúa
    comentario = models.TextField()  # Comentario
    me_interesa = models.BooleanField(default=False)  # Indica si le interesa el trueque


class Publicidades(models.Model):
    """
    Modelo para gestionar la publicidad de servicios ofrecidos por los usuarios.
    Incluye campos para el precio, estado, usuario propietario, servicio asociado y fechas de publicación.
    """
    ESTADO_CHOICES = [
        ('activada', 'Activada'),
        ('desactivada', 'Desactivada'),
    ]
    precio_publicidad = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)  # Precio de la publicidad
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Usuario propietario
    estado = models.CharField(max_length=50, choices=ESTADO_CHOICES, default='desactivada')  # Estado
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)  # Servicio asociado
    fecha_inicio = models.DateTimeField(editable=False)  # Fecha de inicio
    fecha_fin = models.DateTimeField(null=True, blank=True, editable=False)  # Fecha de fin

    def save(self, *args, **kwargs):
        """
        Asigna la fecha de inicio y calcula la fecha de fin automáticamente.
        """
        if not self.fecha_inicio:
            self.fecha_inicio = timezone.now()
        if self.servicio and self.servicio.dias_anuncio:
            self.fecha_fin = self.fecha_inicio + timedelta(days=self.servicio.dias_anuncio)
        super().save(*args, **kwargs)

    def clean(self):
        """
        Valida que el precio de la publicidad no sea negativo.
        """
        if self.precio_publicidad < 0:
            raise Exception("El precio de la publicidad no puede ser negativo.")


class Contactos(models.Model):
    """
    Modelo para representar los mensajes de contacto enviados por los usuarios.
    Incluye campos para el usuario remitente, correo, opción de promocionarse, mensaje y fecha de envío.
    """
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Usuario remitente
    correo = models.EmailField(max_length=50)  # Correo electrónico
    promocionarse = models.BooleanField(default=False)  # Si desea promocionarse
    mensaje = models.TextField()  # Mensaje
    fecha_envio = models.DateTimeField(auto_now_add=True)  # Fecha de envío
    leido = models.BooleanField(default=False)  # Indica si el mensaje fue leído

    def clean(self):
        """
        Valida que el mensaje no esté vacío y que el correo sea válido.
        """
        if len(self.mensaje.strip()) < 1:
            raise Exception("El mensaje no puede estar vacío.")
        if "@" not in self.correo or "." not in self.correo:
            raise Exception("Correo electrónico inválido.")
