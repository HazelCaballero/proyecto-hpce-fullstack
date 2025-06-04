from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# Usuario personalizado extendiendo AbstractUser
class CustomUser(AbstractUser):
    # Campos adicionales para el usuario
    telefono = models.CharField(max_length=20, null=False, blank=False, default='00000000')
    fecha_nacimiento = models.DateField(null=False, blank=False, default='1990-01-01')
    intereses = models.TextField(null=False, blank=False, default='N/A')
    aportaciones = models.TextField(null=False, blank=False, default='N/A')
    ubicacion = models.CharField(max_length=80, null=False, blank=False, default='N/A')
    imagen_url = models.TextField(null=True, blank=True, default='')
    
    # Validaciones personalizadas para el modelo
    def clean(self):
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
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aceptado', 'Aceptado'),
        ('cancelado', 'Cancelado'),
    ]
    titulo = models.CharField(max_length=100)
    trueque = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='pendiente')
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    ubicacion = models.CharField(max_length=80)
    imagen_url = models.TextField(null=True, blank=True)

    # Validación personalizada para el título
    def clean(self):
        if len(self.titulo) < 3:
            raise Exception("El título debe tener al menos 3 caracteres.")

# Modelo para publicaciones generales
class Publicacion(models.Model):
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
    producto = models.CharField(max_length=100)
    contenido = models.TextField()
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    precio_servicio = models.DecimalField(max_digits=10, decimal_places=2)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    # Validaciones para el producto y el precio
    def clean(self):
        if len(self.producto) < 2:
            raise Exception("El producto debe tener al menos 2 caracteres.")
        if self.precio_servicio < 0:
            raise Exception("El precio no puede ser negativo.")

# Modelo para interacciones en trueques (comentarios y me interesa)
class InteraccionTrueque(models.Model):
    trueque = models.ForeignKey(Trueque, on_delete=models.CASCADE)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comentario = models.TextField()
    me_interesa = models.BooleanField(default=False)

# Modelo para publicidades de servicios
class Publicidades(models.Model):
    ESTADO_CHOICES = [
        ('activada', 'Activada'),
        ('desactivada', 'Desactivada'),
    ]
    precio_publicidad = models.DecimalField(max_digits=6, decimal_places=2)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    estado = models.CharField(max_length=50, choices=ESTADO_CHOICES, default='desactivada')
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)

    # Validación para el precio de la publicidad
    def clean(self):
        if self.precio_publicidad < 0:
            raise Exception("El precio de la publicidad no puede ser negativo.")

# Modelo para contactos (mensajes de usuarios)
class Contactos(models.Model):
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    correo = models.EmailField(max_length=50, unique=True)
    promocionarse = models.BooleanField(default=False)
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)

    # Validaciones para el mensaje y el correo
    def clean(self):
        if len(self.mensaje.strip()) < 1:
            raise Exception("El mensaje no puede estar vacío.")
        if "@" not in self.correo or "." not in self.correo:
            raise Exception("Correo electrónico inválido.")
