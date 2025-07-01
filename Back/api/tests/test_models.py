import pytest
from api.models import CustomUser
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_customuser_creation():
    user = CustomUser.objects.create_user(
        username='testuser',
        password='testpass123',
        email='test@example.com',
        telefono='12345678',
        fecha_nacimiento='2000-01-01',
        intereses='interes',
        aportaciones='aportacion',
        ubicacion='Ciudad',
        rol='usuaria'
    )
    assert user.username == 'testuser'
    assert user.check_password('testpass123')
    assert str(user) == 'testuser'

@pytest.mark.django_db
def test_usuarios_list_endpoint():
    client = APIClient()
    # Crea un usuario para que la lista no esté vacía
    CustomUser.objects.create_user(
        username='testuser2',
        password='testpass123',
        email='test2@example.com',
        telefono='12345678',
        fecha_nacimiento='2000-01-01',
        intereses='interes',
        aportaciones='aportacion',
        ubicacion='Ciudad',
        rol='usuaria'
    )
    response = client.get('/usuarios/')
    assert response.status_code == 200
    assert any('testuser2' in str(u) for u in response.data)

@pytest.mark.django_db
def test_categoria_creation():
    from api.models import Categoria
    categoria = Categoria.objects.create(nombre='Alimentos')
    assert categoria.nombre == 'Alimentos'
    assert str(categoria) == 'Alimentos'

@pytest.mark.django_db
def test_categorias_list_endpoint():
    from api.models import Categoria
    client = APIClient()
    Categoria.objects.create(nombre='Tecnología')
    response = client.get('/categorias/')
    assert response.status_code == 200
    assert any('Tecnología' in str(c) for c in response.data)

@pytest.mark.django_db
def test_trueque_creation():
    from api.models import Trueque, CustomUser, Categoria
    user = CustomUser.objects.create_user(
        username='truequeuser', password='pass', email='tq@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='Intercambio')
    trueque = Trueque.objects.create(
        titulo='Cambio libros',
        trueque='Intercambio de libros usados',
        usuario=user,
        estado='pendiente',
        categoria=categoria,
        ubicacion='Ciudad',
    )
    assert trueque.titulo == 'Cambio libros'
    assert trueque.usuario == user
    assert trueque.categoria == categoria

@pytest.mark.django_db
def test_trueques_list_endpoint():
    from api.models import Trueque, CustomUser, Categoria
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='truequeuser2', password='pass', email='tq2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='Ropa')
    Trueque.objects.create(
        titulo='Cambio ropa',
        trueque='Intercambio de ropa',
        usuario=user,
        estado='pendiente',
        categoria=categoria,
        ubicacion='Ciudad',
    )
    response = client.get('/trueques/')
    assert response.status_code == 200
    assert any('Cambio ropa' in str(t) for t in response.data)

@pytest.mark.django_db
def test_publicacion_creation():
    from api.models import Publicacion, CustomUser
    user = CustomUser.objects.create_user(
        username='pubuser', password='pass', email='pub@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='Mi publicación',
        publicacion='Contenido de la publicación',
        usuario=user
    )
    assert publicacion.titulo == 'Mi publicación'
    assert publicacion.usuario == user

@pytest.mark.django_db
def test_publicaciones_list_endpoint():
    from api.models import Publicacion, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='pubuser2', password='pass', email='pub2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    Publicacion.objects.create(
        titulo='Otra publicación',
        publicacion='Texto',
        usuario=user
    )
    response = client.get('/publicaciones/')
    assert response.status_code == 200
    assert any('Otra publicación' in str(p) for p in response.data)

@pytest.mark.django_db
def test_interaccion_publicacion_creation():
    from api.models import InteraccionPublicacion, Publicacion, CustomUser
    user = CustomUser.objects.create_user(
        username='interuser', password='pass', email='inter@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='Pub', publicacion='Texto', usuario=user
    )
    inter = InteraccionPublicacion.objects.create(
        publicacion=publicacion, usuario=user, comentario='Buen post', me_gusta=True
    )
    assert inter.comentario == 'Buen post'
    assert inter.me_gusta is True

@pytest.mark.django_db
def test_interacciones_publicacion_list_endpoint():
    from api.models import InteraccionPublicacion, Publicacion, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='interuser2', password='pass', email='inter2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='Pub2', publicacion='Texto', usuario=user
    )
    InteraccionPublicacion.objects.create(
        publicacion=publicacion, usuario=user, comentario='Me gusta', me_gusta=True
    )
    response = client.get('/interacciones-publicacion/')
    assert response.status_code == 200
    assert any('Me gusta' in str(i) for i in response.data)

@pytest.mark.django_db
def test_servicio_creation():
    from api.models import Servicio, CustomUser
    user = CustomUser.objects.create_user(
        username='servuser', password='pass', email='serv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProductoX', contenido='Detalle', precio_producto=100, monto_pagado=500, usuario=user
    )
    assert servicio.producto == 'ProductoX'
    assert servicio.usuario == user
    assert servicio.dias_anuncio == 2

@pytest.mark.django_db
def test_servicios_list_endpoint():
    from api.models import Servicio, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='servuser2', password='pass', email='serv2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    Servicio.objects.create(
        producto='ProductoY', contenido='Detalle', precio_producto=200, monto_pagado=500, usuario=user
    )
    response = client.get('/servicios/')
    assert response.status_code == 200
    assert any('ProductoY' in str(s) for s in response.data)

@pytest.mark.django_db
def test_interaccion_trueque_creation():
    from api.models import InteraccionTrueque, Trueque, CustomUser, Categoria
    user = CustomUser.objects.create_user(
        username='ituser', password='pass', email='it@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='Libros')
    trueque = Trueque.objects.create(
        titulo='Libro', trueque='Intercambio', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    inter = InteraccionTrueque.objects.create(
        trueque=trueque, usuario=user, comentario='Me interesa', me_interesa=True
    )
    assert inter.comentario == 'Me interesa'
    assert inter.me_interesa is True

@pytest.mark.django_db
def test_interacciones_trueque_list_endpoint():
    from api.models import InteraccionTrueque, Trueque, CustomUser, Categoria
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='ituser2', password='pass', email='it2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='Juguetes')
    trueque = Trueque.objects.create(
        titulo='Juguete', trueque='Intercambio', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    InteraccionTrueque.objects.create(
        trueque=trueque, usuario=user, comentario='Me interesa mucho', me_interesa=True
    )
    response = client.get('/interacciones-trueque/')
    assert response.status_code == 200
    assert any('Me interesa mucho' in str(i) for i in response.data)

@pytest.mark.django_db
def test_publicidades_creation():
    from api.models import Publicidades, Servicio, CustomUser
    user = CustomUser.objects.create_user(
        username='publiuser', password='pass', email='publi@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProdZ', contenido='Desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    publi = Publicidades.objects.create(
        precio_publicidad=1, usuario=user, estado='activada', servicio=servicio, fecha_inicio=None
    )
    assert publi.precio_publicidad == 1
    assert publi.usuario == user
    assert publi.servicio == servicio

@pytest.mark.django_db
def test_publicidades_list_endpoint():
    from api.models import Publicidades, Servicio, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='publiuser2', password='pass', email='publi2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProdW', contenido='Desc', precio_producto=200, monto_pagado=500, usuario=user
    )
    Publicidades.objects.create(
        precio_publicidad=1, usuario=user, estado='activada', servicio=servicio, fecha_inicio=None
    )
    response = client.get('/publicidades/')
    assert response.status_code == 200
    assert any('ProdW' in str(p) for p in response.data)

@pytest.mark.django_db
def test_contactos_creation():
    from api.models import Contactos, CustomUser
    user = CustomUser.objects.create_user(
        username='contuser', password='pass', email='cont@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    contacto = Contactos.objects.create(
        usuario=user, correo='cont@example.com', promocionarse=True, mensaje='Hola', leido=False
    )
    assert contacto.usuario == user
    assert contacto.mensaje == 'Hola'
    assert contacto.promocionarse is True

@pytest.mark.django_db
def test_contactos_list_endpoint():
    from api.models import Contactos, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='contuser2', password='pass', email='cont2@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    Contactos.objects.create(
        usuario=user, correo='cont2@example.com', promocionarse=False, mensaje='Mensaje de contacto', leido=False
    )
    response = client.get('/contactos/')
    assert response.status_code == 200
    assert any('Mensaje de contacto' in str(c) for c in response.data)