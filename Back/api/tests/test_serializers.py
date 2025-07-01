from rest_framework import serializers
from api.models import CustomUser, Categoria, Trueque, Publicacion, InteraccionPublicacion, Servicio, InteraccionTrueque, Publicidades, Contactos

import pytest
from api.serializers import CustomUserSerializer, CategoriaSerializer, TruequeSerializer, PublicacionSerializer, InteraccionPublicacionSerializer, ServicioSerializer, InteraccionTruequeSerializer, PublicidadesSerializer, ContactosSerializer

# CUSTOMUSER
@pytest.mark.django_db
def test_customuser_serializer():
    user = CustomUser.objects.create_user(
        username='serialuser', password='pass', email='serial@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    serializer = CustomUserSerializer(user)
    assert serializer.data['username'] == 'serialuser'
    assert serializer.data['email'] == 'serial@example.com'

@pytest.mark.django_db
def test_customuser_serializer_invalid_email():
    data = {
        'username': 'bademail', 'password': 'pass', 'email': 'noemail', 'telefono': '12345678',
        'fecha_nacimiento': '2000-01-01', 'intereses': 'i', 'aportaciones': 'a', 'ubicacion': 'Ciudad', 'rol': 'usuaria'
    }
    serializer = CustomUserSerializer(data=data)
    assert not serializer.is_valid()
    assert 'email' in serializer.errors

# CATEGORIA
@pytest.mark.django_db
def test_categoria_serializer():
    categoria = Categoria.objects.create(nombre='TestCat')
    serializer = CategoriaSerializer(categoria)
    assert serializer.data['nombre'] == 'TestCat'

@pytest.mark.django_db
def test_categoria_serializer_nombre_corto():
    data = {'nombre': 'ab'}
    serializer = CategoriaSerializer(data=data)
    assert not serializer.is_valid()
    assert 'nombre' in serializer.errors

# TRUEQUE
@pytest.mark.django_db
def test_trueque_serializer():
    user = CustomUser.objects.create_user(
        username='tqser', password='pass', email='tqser@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatSer')
    trueque = Trueque.objects.create(
        titulo='TQ Serial', trueque='Desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    serializer = TruequeSerializer(trueque)
    assert serializer.data['titulo'] == 'TQ Serial'
    assert serializer.data['categoria']['nombre'] == 'CatSer'

@pytest.mark.django_db
def test_trueque_serializer_titulo_corto():
    user = CustomUser.objects.create_user(
        username='tqser2', password='pass', email='tqser2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatSer2')
    data = {
        'titulo': 'a', 'trueque': 'desc', 'usuario': user.id, 'estado': 'pendiente', 'categoria': categoria.id, 'ubicacion': 'Ciudad'
    }
    serializer = TruequeSerializer(data=data)
    assert not serializer.is_valid()
    assert 'titulo' in serializer.errors

# PUBLICACION
@pytest.mark.django_db
def test_publicacion_serializer():
    user = CustomUser.objects.create_user(
        username='pubser', password='pass', email='pubser@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='Pub Serial', publicacion='Texto', usuario=user
    )
    serializer = PublicacionSerializer(publicacion)
    assert serializer.data['titulo'] == 'Pub Serial'

@pytest.mark.django_db
def test_publicacion_serializer_titulo_corto():
    user = CustomUser.objects.create_user(
        username='pubser2', password='pass', email='pubser2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    data = {'titulo': 'a', 'publicacion': 'desc', 'usuario': user.id}
    serializer = PublicacionSerializer(data=data)
    assert not serializer.is_valid()
    assert 'titulo' in serializer.errors

# INTERACCION PUBLICACION
@pytest.mark.django_db
def test_interaccion_publicacion_serializer():
    user = CustomUser.objects.create_user(
        username='intpubser', password='pass', email='intpubser@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='PubI', publicacion='Texto', usuario=user
    )
    inter = InteraccionPublicacion.objects.create(
        publicacion=publicacion, usuario=user, comentario='Comentario', me_gusta=True
    )
    serializer = InteraccionPublicacionSerializer(inter)
    assert serializer.data['comentario'] == 'Comentario'
    assert serializer.data['me_gusta'] is True

@pytest.mark.django_db
def test_interaccion_publicacion_serializer_comentario_vacio():
    user = CustomUser.objects.create_user(
        username='intpubser2', password='pass', email='intpubser2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='PubI2', publicacion='Texto', usuario=user
    )
    data = {'publicacion': publicacion.id, 'usuario': user.id, 'comentario': '', 'me_gusta': True}
    serializer = InteraccionPublicacionSerializer(data=data)
    assert not serializer.is_valid()
    assert 'comentario' in serializer.errors

# SERVICIO
@pytest.mark.django_db
def test_servicio_serializer():
    user = CustomUser.objects.create_user(
        username='servser', password='pass', email='servser@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProdSer', contenido='Desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    serializer = ServicioSerializer(servicio)
    assert serializer.data['producto'] == 'ProdSer'

@pytest.mark.django_db
def test_servicio_serializer_producto_corto():
    user = CustomUser.objects.create_user(
        username='servser2', password='pass', email='servser2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    data = {'producto': 'a', 'contenido': 'desc', 'precio_producto': 100, 'monto_pagado': 500, 'usuario': user.id}
    serializer = ServicioSerializer(data=data)
    assert not serializer.is_valid()
    assert 'producto' in serializer.errors

# INTERACCION TRUEQUE
@pytest.mark.django_db
def test_interaccion_trueque_serializer():
    user = CustomUser.objects.create_user(
        username='itqser', password='pass', email='itqser@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatITQ')
    trueque = Trueque.objects.create(
        titulo='TQ ITQ', trueque='Desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    inter = InteraccionTrueque.objects.create(
        trueque=trueque, usuario=user, comentario='Comentario ITQ', me_interesa=True
    )
    serializer = InteraccionTruequeSerializer(inter)
    assert serializer.data['comentario'] == 'Comentario ITQ'
    assert serializer.data['me_interesa'] is True

@pytest.mark.django_db
def test_interaccion_trueque_serializer_comentario_vacio():
    user = CustomUser.objects.create_user(
        username='itqser2', password='pass', email='itqser2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatITQ2')
    trueque = Trueque.objects.create(
        titulo='TQ ITQ2', trueque='Desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    data = {'trueque': trueque.id, 'usuario': user.id, 'comentario': '', 'me_interesa': True}
    serializer = InteraccionTruequeSerializer(data=data)
    assert not serializer.is_valid()
    assert 'comentario' in serializer.errors

# PUBLICIDADES
@pytest.mark.django_db
def test_publicidades_serializer():
    user = CustomUser.objects.create_user(
        username='publiuser', password='pass', email='publiuser@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProdPubli', contenido='Desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    publi = Publicidades.objects.create(
        precio_publicidad=1, usuario=user, estado='activada', servicio=servicio, fecha_inicio=None
    )
    serializer = PublicidadesSerializer(publi)
    assert serializer.data['precio_publicidad'] == '1.00'
    assert serializer.data['producto'] == 'ProdPubli'

@pytest.mark.django_db
def test_publicidades_serializer_precio_negativo():
    user = CustomUser.objects.create_user(
        username='publiuser2', password='pass', email='publiuser2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProdPubli2', contenido='Desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    data = {'precio_publicidad': -10, 'usuario': user.id, 'estado': 'activada', 'servicio': servicio.id}
    serializer = PublicidadesSerializer(data=data)
    assert not serializer.is_valid()
    assert 'precio_publicidad' in serializer.errors

# CONTACTOS
@pytest.mark.django_db
def test_contactos_serializer():
    user = CustomUser.objects.create_user(
        username='contser', password='pass', email='contser@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    contacto = Contactos.objects.create(
        usuario=user, correo='contser@example.com', promocionarse=True, mensaje='Hola', leido=False
    )
    serializer = ContactosSerializer(contacto)
    assert serializer.data['correo'] == 'contser@example.com'
    assert serializer.data['mensaje'] == 'Hola'
    assert serializer.data['promocionarse'] is True

@pytest.mark.django_db
def test_contactos_serializer_correo_invalido():
    user = CustomUser.objects.create_user(
        username='contser2', password='pass', email='contser2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    data = {'usuario': user.id, 'correo': 'noemail', 'promocionarse': True, 'mensaje': 'Hola', 'leido': False}
    serializer = ContactosSerializer(data=data)
    assert not serializer.is_valid()
    assert 'correo' in serializer.errors

@pytest.mark.django_db
def test_contactos_serializer_mensaje_vacio():
    user = CustomUser.objects.create_user(
        username='contser3', password='pass', email='contser3@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    data = {'usuario': user.id, 'correo': 'contser3@example.com', 'promocionarse': True, 'mensaje': '', 'leido': False}
    serializer = ContactosSerializer(data=data)
    assert not serializer.is_valid()
    assert 'mensaje' in serializer.errors