# Importaciones necesarias de DRF y modelos propios
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import (
    CustomUser, Categoria, Trueque, Publicacion, InteraccionPublicacion,
    Servicio, InteraccionTrueque, Publicidades, Contactos
)
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CustomUser
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, BasePermission
from .serializers import (
    CustomUserSerializer, CategoriaSerializer, TruequeSerializer, PublicacionSerializer,
    InteraccionPublicacionSerializer, ServicioSerializer, InteraccionTruequeSerializer,
    PublicidadesSerializer, ContactosSerializer
)

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.decorators import action

# Permisos personalizados

# Permiso personalizado para verificar si el usuario es superusuario
class IsSuperUser(BasePermission):
    """
    Permite el acceso solo a superusuarios o usuarios con rol 'superusuario'.
    """
    def has_permission(self, request, view):
        return request.user and (request.user.is_superuser or getattr(request.user, 'rol', None) == 'superusuario')


# Permiso personalizado para verificar si el usuario es moderador
class IsModerator(BasePermission):
    """
    Permite el acceso a usuarios con rol 'moderador', 'superusuario' o superusuarios.
    """
    def has_permission(self, request, view):
        return request.user and (getattr(request.user, 'rol', None) == 'moderador' or getattr(request.user, 'rol', None) == 'superusuario' or request.user.is_superuser)


# Permiso personalizado para verificar si el usuario es soporte
class IsSupport(BasePermission):
    """
    Permite el acceso a usuarios con rol 'soporte', 'superusuario' o superusuarios.
    """
    def has_permission(self, request, view):
        return request.user and (getattr(request.user, 'rol', None) == 'soporte' or getattr(request.user, 'rol', None) == 'superusuario' or request.user.is_superuser)


# Permiso personalizado para verificar si el usuario es el propietario del objeto, un moderador o un superusuario
class IsOwnerOrModeratorOrSuperUser(BasePermission):
    """
    Permite el acceso si el usuario es el propietario del objeto,
    un moderador o un superusuario.
    """
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_superuser or
            getattr(request.user, 'rol', None) == 'superusuario' or
            getattr(request.user, 'rol', None) == 'moderador' or
            obj.usuario == request.user
        )


# Permiso personalizado para verificar si el usuario es el propietario del objeto o un superusuario
class IsOwnerOrSuperUser(BasePermission):
    """
    Permite el acceso si el usuario es el propietario del objeto
    o un superusuario.
    """
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or getattr(request.user, 'rol', None) == 'superusuario' or obj.usuario == request.user



# Vistas

# Vista para listar y crear usuarios personalizados
class CustomUserListCreateView(ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    
    # Al crear un usuario, se asegura de que la contraseña se guarde de forma segura
    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(user.password)
        user.save()


# Vista para obtener, actualizar o eliminar un usuario específico
class CustomUserDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer



# Vista para listar y crear categorías
class CategoriaListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


# Vista para obtener, actualizar o eliminar una categoría (solo superusuarios pueden modificar)
class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def delete(self, request, *args, **kwargs):
        categoria = self.get_object()
        trueques_count = categoria.trueque_set.count()
        if trueques_count > 0 and request.query_params.get('force') != 'true':
            return Response({
                'detail': f'Esta categoría tiene {trueques_count} trueques asociados. ¿Deseas eliminarla junto con todos sus trueques? Envía force=true para confirmar.'
            }, status=status.HTTP_409_CONFLICT)
        return super().delete(request, *args, **kwargs)


# Vista para listar y crear trueques
class TruequeListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Trueque.objects.select_related('categoria', 'usuario').all()
    serializer_class = TruequeSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


# Vista para obtener, actualizar o eliminar un trueque
class TruequeDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Trueque.objects.select_related('categoria', 'usuario').all()
    serializer_class = TruequeSerializer


# Vista para listar y crear publicaciones
class PublicacionListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer


# Vista para obtener, actualizar o eliminar una publicación
class PublicacionDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrModeratorOrSuperUser]
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionSerializer



# Vista para listar y crear interacciones en publicaciones
class InteraccionPublicacionListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InteraccionPublicacion.objects.all()
    serializer_class = InteraccionPublicacionSerializer


# Vista para obtener, actualizar o eliminar una interacción en publicación
class InteraccionPublicacionDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrModeratorOrSuperUser]
    queryset = InteraccionPublicacion.objects.all()
    serializer_class = InteraccionPublicacionSerializer


# Vista para listar y crear servicios
class ServicioListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer


# Vista para obtener, actualizar o eliminar un servicio (solo superusuarios pueden modificar)
class ServicioDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer



# Vista para listar y crear interacciones en trueques
class InteraccionTruequeListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InteraccionTruequeSerializer

    def get_queryset(self):
        queryset = InteraccionTrueque.objects.all()
        trueque_id = self.request.query_params.get('trueque')
        if trueque_id:
            queryset = queryset.filter(trueque_id=trueque_id)
        return queryset


# Vista para obtener, actualizar o eliminar una interacción en trueque
class InteraccionTruequeDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsOwnerOrModeratorOrSuperUser]
    queryset = InteraccionTrueque.objects.all()
    serializer_class = InteraccionTruequeSerializer


# Vista para listar y crear publicidades
class PublicidadesListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Publicidades.objects.all()
    serializer_class = PublicidadesSerializer


# Vista para obtener, actualizar o eliminar una publicidad (solo superusuarios pueden modificar)
class PublicidadesDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = Publicidades.objects.all()
    serializer_class = PublicidadesSerializer


# Vista para listar y crear contactos
class ContactosListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Contactos.objects.all()
    serializer_class = ContactosSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


# Vista para obtener, actualizar o eliminar un contacto (soporte o superusuario pueden modificar)
class ContactosDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSupport]
    queryset = Contactos.objects.all()
    serializer_class = ContactosSerializer


# Vista para crear un superusuario (solo superusuarios pueden acceder)
class CrearSuperUsuario(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        # Crea un nuevo superusuario
        CustomUser.objects.create_superuser(
            username=username,
            password=password,
        )
        return Response({"message": "Superusuario creado exitosamente."}, status=status.HTTP_201_CREATED)

# Vista para listar todos los superusuarios
class VerSuperUsuario(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    def get(self, request):
        superusers = CustomUser.objects.filter(is_superuser=True)
        serializer = CustomUserSerializer(superusers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Vista para eliminar un superusuario por su ID
class EliminarSuperUsuario(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    def delete(self, request, pk):
        try:
            superuser = CustomUser.objects.get(pk=pk, is_superuser=True)
            superuser.delete()
            return Response({"message": "Superusuario eliminado exitosamente."}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"error": "Superusuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

# Vista para actualizar los datos de un superusuario
class ActualizarSuperUsuario(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    def put(self, request, pk):
        try:
            superuser = CustomUser.objects.get(pk=pk, is_superuser=True)
            serializer = CustomUserSerializer(superuser, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"error": "Superusuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class AsignarRolUsuariaView(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    def patch(self, request, pk):
        try:
            usuaria = CustomUser.objects.get(pk=pk)
            nuevo_rol = request.data.get('rol')
            if nuevo_rol not in dict(CustomUser.ROL_CHOICES):
                return Response({'error': 'Rol no válido.'}, status=status.HTTP_400_BAD_REQUEST)
            usuaria.rol = nuevo_rol
            usuaria.save()
            return Response({'message': f'Rol actualizado a {nuevo_rol} para {usuaria.username}.'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Usuaria no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

