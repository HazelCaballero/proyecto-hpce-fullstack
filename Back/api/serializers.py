from rest_framework import serializers
from .models import (
    CustomUser, Categoria, Trueque, Publicacion, InteraccionPublicacion,
    Servicio, InteraccionTrueque, Publicidades, Contactos
)

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'password', 'email',
            'telefono', 'fecha_nacimiento', 'intereses',
            'aportaciones', 'ubicacion', 'imagen_url'
        ]
        #si elimino esto puedo ver la contraseña
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        user.email = validated_data.get('email', '')
        user.telefono = validated_data.get('telefono', '')
        user.fecha_nacimiento = validated_data.get('fecha_nacimiento', None)
        user.intereses = validated_data.get('intereses', '')
        user.aportaciones = validated_data.get('aportaciones', '')
        user.ubicacion = validated_data.get('ubicacion', '')
        user.imagen_url = validated_data.get('imagen_url', '')
        user.save()
        return user

    def validate_telefono(self, value):
        if value and (not value.replace("+", "").isdigit() or not (7 <= len(value.replace("+", "")) <= 15)):
            raise serializers.ValidationError("Número de teléfono inválido.")
        return value

    def validate_fecha_nacimiento(self, value):
        from datetime import date
        if value and value > date.today():
            raise serializers.ValidationError("La fecha de nacimiento no puede ser en el futuro.")
        return value

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class TruequeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trueque
        fields = '__all__'

class PublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = '__all__'

class InteraccionPublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteraccionPublicacion
        fields = '__all__'

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

class InteraccionTruequeSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteraccionTrueque
        fields = '__all__'

class PublicidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicidades
        fields = '__all__'

class ContactosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contactos
        fields = '__all__'