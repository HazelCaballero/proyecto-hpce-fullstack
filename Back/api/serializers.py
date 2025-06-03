from rest_framework import serializers
from .models import (
    CustomUser, Categoria, Trueque, Publicacion, InteraccionPublicacion,
    Servicio, InteraccionTrueque, Publicidades, Contactos
)

# Serializador para el modelo de usuario personalizado
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'password', 'email',
            'telefono', 'fecha_nacimiento', 'intereses',
            'aportaciones', 'ubicacion', 'imagen_url'
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
    class Meta:
        model = InteraccionTrueque
        fields = '__all__'

# Serializador para el modelo Publicidades
class PublicidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicidades
        fields = '__all__'

# Serializador para el modelo Contactos
class ContactosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contactos
        fields = ['correo', 'mensaje', 'promocionarse']