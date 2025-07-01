from rest_framework import serializers
from .models import (
    CustomUser, Categoria, Trueque, Publicacion, InteraccionPublicacion,
    Servicio, InteraccionTrueque, Publicidades, Contactos
)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Serializadores de la app


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
            'aportaciones', 'ubicacion', 'imagen_url', 'rol', 'is_active'
        ]
        # Si se descomenta la siguiente línea, la contraseña será solo de escritura
        # extra_kwargs = {
        #     'password': {'write_only': True}
        # }

    def validate_telefono(self, value):
        """
        Valida que el teléfono tenga un formato correcto.
        """
        if value and (not value.replace("+", "").isdigit() or not (7 <= len(value.replace("+", "")) <= 15)):
            raise serializers.ValidationError("Número de teléfono inválido.")
        return value


class CategoriaSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Categoria.
    """
    class Meta:
        model = Categoria
        fields = '__all__'


class TruequeSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Trueque.
    Incluye la categoría relacionada y el nombre del usuario creador.
    """
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source='categoria', write_only=True
    )
    usuario = serializers.PrimaryKeyRelatedField(read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = Trueque
        fields = ['id', 'titulo', 'estado', 'categoria', 'categoria_id', 'ubicacion', 'imagen_url', 'usuario', 'usuario_nombre']


class PublicacionSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Publicacion.
    """
    class Meta:
        model = Publicacion
        fields = '__all__'


class InteraccionPublicacionSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo InteraccionPublicacion.
    """
    class Meta:
        model = InteraccionPublicacion
        fields = '__all__'


class ServicioSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Servicio.
    """
    class Meta:
        model = Servicio
        fields = '__all__'


class InteraccionTruequeSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo InteraccionTrueque.
    Incluye el nombre de usuario de la persona interesada en el trueque.
    """
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = InteraccionTrueque
        fields = ['id', 'trueque', 'usuario', 'usuario_nombre', 'comentario', 'me_interesa']


class PublicidadesSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Publicidades.
    Incluye datos del servicio relacionado (producto, contenido, precio, imagen).
    """
    producto = serializers.CharField(source='servicio.producto', read_only=True)
    contenido = serializers.CharField(source='servicio.contenido', read_only=True)
    precio_servicio = serializers.DecimalField(source='servicio.precio_producto', max_digits=10, decimal_places=2, read_only=True)
    imagen_url = serializers.CharField(source='servicio.imagen_url', read_only=True, default='')

    class Meta:
        model = Publicidades
        fields = '__all__'
        read_only_fields = ('fecha_inicio', 'fecha_fin', 'precio_publicidad', 'producto', 'contenido', 'precio_servicio', 'imagen_url')


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
    """
    Serializador personalizado para la obtención de tokens JWT.
    Agrega el campo 'is_superuser' al token y a la respuesta.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_superuser'] = user.is_superuser
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_superuser'] = self.user.is_superuser
        return data
