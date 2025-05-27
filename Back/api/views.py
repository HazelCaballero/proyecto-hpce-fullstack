from rest_framework import generics
from .models import (
    CustomUser, Categoria, Trueque, Publicacion, InteraccionPublicacion,
    Servicio, InteraccionTrueque, Publicidades, Contactos
)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, BasePermission
from .serializers import (
    CustomUserSerializer, CategoriaSerializer, TruequeSerializer, PublicacionSerializer,
    InteraccionPublicacionSerializer, ServicioSerializer, InteraccionTruequeSerializer,
    PublicidadesSerializer, ContactosSerializer
)

class IsSuperUser(BasePermission):
  
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

class CustomUserListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class CustomUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class CategoriaListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class TruequeListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Trueque.objects.all()
    serializer_class = TruequeSerializer

class TruequeDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Trueque.objects.all()
    serializer_class = TruequeSerializer

class PublicacionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer

class PublicacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer

class InteraccionPublicacionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InteraccionPublicacion.objects.all()
    serializer_class = InteraccionPublicacionSerializer

class InteraccionPublicacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InteraccionPublicacion.objects.all()
    serializer_class = InteraccionPublicacionSerializer

class ServicioListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

class ServicioDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

class InteraccionTruequeListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InteraccionTrueque.objects.all()
    serializer_class = InteraccionTruequeSerializer

class InteraccionTruequeDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InteraccionTrueque.objects.all()
    serializer_class = InteraccionTruequeSerializer

class PublicidadesListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = Publicidades.objects.all()
    serializer_class = PublicidadesSerializer

class PublicidadesDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = Publicidades.objects.all()
    serializer_class = PublicidadesSerializer

class ContactosListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Contactos.objects.all()
    serializer_class = ContactosSerializer

class ContactosDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = Contactos.objects.all()
    serializer_class = ContactosSerializer

class CrearSuperUsuario(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        usuername = request.data.get('username')
        password = request.data.get('password')
        
        User.objects.create_superuser(
            usuername=usuername,
            password=password,
        )
        
        return Response({"message": "Superusuario creado exitosamente."}, status=status.HTTP_201_CREATED)
    
class VerSuperUsuario(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        superusers = User.objects.filter(is_superuser=True)
        serializer = CustomUserSerializer(superusers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class EliminarSuperUsuario(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, pk):
        try:
            superuser = User.objects.get(pk=pk, is_superuser=True)
            superuser.delete()
            return Response({"message": "Superusuario eliminado exitosamente."}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "Superusuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

class ActualizarSuperUsuario(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, pk):
        try:
            superuser = User.objects.get(pk=pk, is_superuser=True)
            serializer = CustomUserSerializer(superuser, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "Superusuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

