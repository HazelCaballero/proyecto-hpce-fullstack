from rest_framework import generics
from .models import (
    CustomUser, Categoria, Trueque, Publicacion, InteraccionPublicacion,
    Servicio, InteraccionTrueque, Publicidades, Contactos
)
from .serializers import (
    CustomUserSerializer, CategoriaSerializer, TruequeSerializer, PublicacionSerializer,
    InteraccionPublicacionSerializer, ServicioSerializer, InteraccionTruequeSerializer,
    PublicidadesSerializer, ContactosSerializer
)

class CustomUserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        self.created_user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "telefono": user.telefono,
            "fecha_nacimiento": user.fecha_nacimiento,
            "intereses": user.intereses,
            "aportaciones": user.aportaciones,
            "ubicacion": user.ubicacion,
            "imagen_url": user.imagen_url,
        }

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if hasattr(self, 'created_user_data'):
            response.data = self.created_user_data
        return response

class CustomUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class CategoriaListCreateView(generics.ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class TruequeListCreateView(generics.ListCreateAPIView):
    queryset = Trueque.objects.all()
    serializer_class = TruequeSerializer

class TruequeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trueque.objects.all()
    serializer_class = TruequeSerializer

class PublicacionListCreateView(generics.ListCreateAPIView):
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer

class PublicacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer

class InteraccionPublicacionListCreateView(generics.ListCreateAPIView):
    queryset = InteraccionPublicacion.objects.all()
    serializer_class = InteraccionPublicacionSerializer

class InteraccionPublicacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InteraccionPublicacion.objects.all()
    serializer_class = InteraccionPublicacionSerializer

class ServicioListCreateView(generics.ListCreateAPIView):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

class ServicioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

class InteraccionTruequeListCreateView(generics.ListCreateAPIView):
    queryset = InteraccionTrueque.objects.all()
    serializer_class = InteraccionTruequeSerializer

class InteraccionTruequeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InteraccionTrueque.objects.all()
    serializer_class = InteraccionTruequeSerializer

class PublicidadesListCreateView(generics.ListCreateAPIView):
    queryset = Publicidades.objects.all()
    serializer_class = PublicidadesSerializer

class PublicidadesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Publicidades.objects.all()
    serializer_class = PublicidadesSerializer

class ContactosListCreateView(generics.ListCreateAPIView):
    queryset = Contactos.objects.all()
    serializer_class = ContactosSerializer

class ContactosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contactos.objects.all()
    serializer_class = ContactosSerializer