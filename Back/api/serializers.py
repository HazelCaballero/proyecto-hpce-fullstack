from rest_framework import serializers
from .models import (
    CustomUser, Categoria, Trueque, Publicacion, InteraccionPublicacion,
    Servicio, InteraccionTrueque, Publicidades, Contactos
)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Serializadores de la app

# Serializador para el modelo de usuario personalizado
class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo CustomUser.
    Permite la conversión entre instancias de usuario y representaciones JSON.
    Incluye validación personalizada para el campo teléfono.
    """
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'password', 'email',
            'telefono', 'fecha_nacimiento', 'intereses',
            'aportaciones', 'ubicacion', 'imagen_url', 'rol'
        ]
        # Si descomento esto la contraseña será solo de escritura
        # extra_kwargs = {
        #     'password': {'write_only': True}
        # }

    # Validación personalizada para el campo teléfono
    def validate_telefono(self, value):
        """
        Valida que el teléfono tenga un formato correcto.
        """
        if value and (not value.replace("+", "").isdigit() or not (7 <= len(value.replace("+", "")) <= 15)):
            raise serializers.ValidationError("Número de teléfono inválido.")
        return value

# Serializador para el modelo Categoria
class CategoriaSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Categoria.
    """
    class Meta:
        model = Categoria
        fields = '__all__'

# Serializador para el modelo Trueque
class TruequeSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Trueque, incluye la categoría relacionada.
    """
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source='categoria', write_only=True
    )

    class Meta:
        model = Trueque
        fields = ['id', 'titulo', 'estado', 'categoria', 'categoria_id', 'ubicacion', 'imagen_url']

# Serializador para el modelo Publicacion
class PublicacionSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Publicacion.
    """
    class Meta:
        model = Publicacion
        fields = '__all__'

# Serializador para el modelo InteraccionPublicacion
class InteraccionPublicacionSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo InteraccionPublicacion.
    """
    class Meta:
        model = InteraccionPublicacion
        fields = '__all__'

# Serializador para el modelo Servicio
class ServicioSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Servicio.
    """
    class Meta:
        model = Servicio
        fields = '__all__'

# Serializador para el modelo InteraccionTrueque
class InteraccionTruequeSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo InteraccionTrueque.
    Incluye el nombre de usuario de la persona interesada en el trueque.
    """
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = InteraccionTrueque
        fields = ['id', 'trueque', 'usuario', 'usuario_nombre', 'comentario', 'me_interesa']

# Serializador para el modelo Publicidades
class PublicidadesSerializer(serializers.ModelSerializer):
    # Incluir datos del servicio relacionado
    producto = serializers.CharField(source='servicio.producto', read_only=True)
    contenido = serializers.CharField(source='servicio.contenido', read_only=True)
    precio_servicio = serializers.DecimalField(source='servicio.precio_producto', max_digits=10, decimal_places=2, read_only=True)
    imagen_url = serializers.CharField(source='servicio.imagen_url', read_only=True, default='')

    class Meta:
        model = Publicidades
        fields = '__all__'
        read_only_fields = ('fecha_inicio', 'fecha_fin', 'precio_publicidad', 'producto', 'contenido', 'precio_servicio', 'imagen_url')

# Serializador para el modelo Contactos
class ContactosSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Contactos.
    Incluye el nombre de usuario, email y la fecha de envío del contacto.
    """
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    fecha_envio = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = Contactos
        fields = ['id', 'correo', 'mensaje', 'promocionarse', 'usuario', 'usuario_nombre', 'usuario_email', 'fecha_envio', 'leido']
        


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token= super().get_token(user)
        token ['is_superuser'] = user.is_superuser
        return token
    
    
    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_superuser'] = self.user.is_superuser
        return data