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
        
    #    extra_kwargs = {
    #        'password': {'write_only': True}
        
    def validate_telefono(self, value):
        if value and (not value.replace("+", "").isdigit() or not (7 <= len(value.replace("+", "")) <= 15)):
            raise serializers.ValidationError("Número de teléfono inválido.")
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