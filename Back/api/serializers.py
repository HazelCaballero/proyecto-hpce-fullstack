from rest_framework import serializers
from .models import (
    CustomUser, Categoria, Trueque, Publicacion, InteraccionPublicacion,
    Servicio, InteraccionTrueque, Publicidades, Contactos
)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Serializador para el modelo de usuario personalizado
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'password', 'email',
            'telefono', 'fecha_nacimiento', 'intereses',
            'aportaciones', 'ubicacion', 'imagen_url', 'rol'
        ]
        # Si descomento esto la contraseña sera solo de escritura
        # extra_kwargs = {
        #     'password': {'write_only': True}
        # }

    # Validación personalizada para el campo teléfono
    def validate_telefono(self, value):
        if value and (not value.replace("+", "").isdigit() or not (7 <= len(value.replace("+", "")) <= 15)):
            raise serializers.ValidationError("Número de teléfono inválido.")
        return value

# Serializador para el modelo Categoria
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

# Serializador para el modelo Trueque
class TruequeSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source='categoria', write_only=True
    )

    class Meta:
        model = Trueque
        fields = '__all__'

# Serializador para el modelo Publicacion
class PublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = '__all__'

# Serializador para el modelo InteraccionPublicacion
class InteraccionPublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteraccionPublicacion
        fields = '__all__'

# Serializador para el modelo Servicio
class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

# Serializador para el modelo InteraccionTrueque
class InteraccionTruequeSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = InteraccionTrueque
        fields = ['id', 'trueque', 'usuario', 'usuario_nombre', 'comentario', 'me_interesa']

# Serializador para el modelo Publicidades
class PublicidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicidades
        fields = '__all__'

# Serializador para el modelo Contactos
class ContactosSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    fecha_envio = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = Contactos
        fields = ['id', 'correo', 'mensaje', 'promocionarse', 'usuario_nombre', 'fecha_envio', 'leido']
        


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