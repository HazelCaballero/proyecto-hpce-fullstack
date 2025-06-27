import pytest
from api.models import CustomUser, Categoria, Trueque, Publicacion
from rest_framework.test import APIClient

def test_view_functionality(client):
    response = client.get('/your-endpoint/')
    assert response.status_code == 200
    assert 'expected_content' in response.data.decode()

@pytest.mark.django_db
def test_customuser_detail_view():
    user = CustomUser.objects.create_user(
        username='viewuser', password='pass', email='view@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    client = APIClient()
    response = client.get(f'/usuarios/{user.id}/')
    assert response.status_code in [200, 401, 403] 
    
@pytest.mark.django_db
def test_categoria_detail_view():
    categoria = Categoria.objects.create(nombre='ViewCat')
    client = APIClient()
    response = client.get(f'/categorias/{categoria.id}/')
    assert response.status_code == 200

@pytest.mark.django_db
def test_trueque_detail_view():
    user = CustomUser.objects.create_user(
        username='viewtq', password='pass', email='viewtq@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='ViewTQCat')
    trueque = Trueque.objects.create(
        titulo='TQ View', trueque='Desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    client = APIClient()
    response = client.get(f'/trueques/{trueque.id}/')
    assert response.status_code == 200

@pytest.mark.django_db
def test_publicacion_detail_view():
    user = CustomUser.objects.create_user(
        username='viewpub', password='pass', email='viewpub@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='Pub View', publicacion='Texto', usuario=user
    )
    client = APIClient()
    response = client.get(f'/publicaciones/{publicacion.id}/')
    assert response.status_code == 200

@pytest.mark.django_db
def test_interaccion_publicacion_detail_view():
    from api.models import InteraccionPublicacion, Publicacion, CustomUser
    user = CustomUser.objects.create_user(
        username='viewipub', password='pass', email='viewipub@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='PubIPub', publicacion='Texto', usuario=user
    )
    inter = InteraccionPublicacion.objects.create(
        publicacion=publicacion, usuario=user, comentario='Comentario', me_gusta=True
    )
    client = APIClient()
    response = client.get(f'/interacciones-publicacion/{inter.id}/')
    assert response.status_code == 200

@pytest.mark.django_db
def test_servicio_detail_view():
    from api.models import Servicio, CustomUser
    user = CustomUser.objects.create_user(
        username='viewserv', password='pass', email='viewserv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProdView', contenido='Desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    client = APIClient()
    response = client.get(f'/servicios/{servicio.id}/')
    assert response.status_code == 200

@pytest.mark.django_db
def test_interaccion_trueque_detail_view():
    from api.models import InteraccionTrueque, Trueque, CustomUser, Categoria
    user = CustomUser.objects.create_user(
        username='viewitq', password='pass', email='viewitq@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatViewITQ')
    trueque = Trueque.objects.create(
        titulo='TQ ITQ View', trueque='Desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    inter = InteraccionTrueque.objects.create(
        trueque=trueque, usuario=user, comentario='Comentario ITQ', me_interesa=True
    )
    client = APIClient()
    response = client.get(f'/interacciones-trueque/{inter.id}/')
    assert response.status_code == 200

@pytest.mark.django_db
def test_publicidades_detail_view():
    from api.models import Publicidades, Servicio, CustomUser
    user = CustomUser.objects.create_user(
        username='viewpubli', password='pass', email='viewpubli@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProdViewPubli', contenido='Desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    publi = Publicidades.objects.create(
        precio_publicidad=250, usuario=user, estado='activada', servicio=servicio, fecha_inicio=None
    )
    client = APIClient()
    response = client.get(f'/publicidades/{publi.id}/')
    assert response.status_code == 200

@pytest.mark.django_db
def test_contactos_detail_view():
    from api.models import Contactos, CustomUser
    user = CustomUser.objects.create_user(
        username='viewcont', password='pass', email='viewcont@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    contacto = Contactos.objects.create(
        usuario=user, correo='viewcont@example.com', promocionarse=True, mensaje='Hola', leido=False
    )
    client = APIClient()
    response = client.get(f'/contactos/{contacto.id}/')
    assert response.status_code == 200

@pytest.mark.django_db
def test_categoria_create_invalid():
    client = APIClient()
    # Nombre muy corto
    response = client.post('/categorias/', {'nombre': 'abc'})
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_categoria_create_duplicate():
    from api.models import Categoria
    client = APIClient()
    Categoria.objects.create(nombre='Duplicada')
    response = client.post('/categorias/', {'nombre': 'Duplicada'})
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_categoria_update():
    from api.models import Categoria
    client = APIClient()
    cat = Categoria.objects.create(nombre='ActualizarCat')
    response = client.patch(f'/categorias/{cat.id}/', {'nombre': 'CatActualizada'})
    assert response.status_code in [200, 202]

@pytest.mark.django_db
def test_categoria_delete():
    from api.models import Categoria
    client = APIClient()
    cat = Categoria.objects.create(nombre='EliminarCat')
    response = client.delete(f'/categorias/{cat.id}/')
    assert response.status_code in [204, 200]
    # Intentar eliminar de nuevo
    response = client.delete(f'/categorias/{cat.id}/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_usuario_detail_requires_auth():
    from api.models import CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(username='authuser', password='pass', email='a@a.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria')
    response = client.get(f'/usuarios/{user.id}/')
    assert response.status_code in [401, 403]

@pytest.mark.django_db
def test_usuario_create_invalid_email():
    client = APIClient()
    response = client.post('/usuarios/', {
        'username': 'bademail',
        'password': 'pass',
        'email': 'noemail',
        'telefono': '12345678',
        'fecha_nacimiento': '2000-01-01',
        'intereses': 'i',
        'aportaciones': 'a',
        'ubicacion': 'Ciudad',
        'rol': 'usuaria'
    })
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_get_nonexistent_categoria():
    client = APIClient()
    response = client.get('/categorias/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_update_nonexistent_categoria():
    client = APIClient()
    response = client.patch('/categorias/99999/', {'nombre': 'NoExiste'})
    assert response.status_code == 404

@pytest.mark.django_db
def test_delete_nonexistent_categoria():
    client = APIClient()
    response = client.delete('/categorias/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_list_empty_categorias():
    from api.models import Categoria
    Categoria.objects.all().delete()
    client = APIClient()
    response = client.get('/categorias/')
    assert response.status_code == 200
    assert response.data == []

@pytest.mark.django_db
def test_trueque_create_invalid():
    from api.models import CustomUser, Categoria
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='tqinv', password='pass', email='tqinv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatTQInv')
    # Título muy corto
    response = client.post('/trueques/', {
        'titulo': 'a', 'trueque': 'desc', 'usuario': user.id, 'estado': 'pendiente', 'categoria': categoria.id, 'ubicacion': 'Ciudad'
    })
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_trueque_update():
    from api.models import Trueque, CustomUser, Categoria
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='tqup', password='pass', email='tqup@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatTQUp')
    trueque = Trueque.objects.create(
        titulo='TQUp', trueque='desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    response = client.patch(f'/trueques/{trueque.id}/', {'titulo': 'TQUpdated'})
    assert response.status_code in [200, 202]

@pytest.mark.django_db
def test_trueque_delete():
    from api.models import Trueque, CustomUser, Categoria
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='tqdel', password='pass', email='tqdel@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatTQDel')
    trueque = Trueque.objects.create(
        titulo='TQDel', trueque='desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    response = client.delete(f'/trueques/{trueque.id}/')
    assert response.status_code in [204, 200]
    # Intentar eliminar de nuevo
    response = client.delete(f'/trueques/{trueque.id}/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_get_nonexistent_trueque():
    client = APIClient()
    response = client.get('/trueques/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_update_nonexistent_trueque():
    client = APIClient()
    response = client.patch('/trueques/99999/', {'titulo': 'NoExiste'})
    assert response.status_code == 404

@pytest.mark.django_db
def test_delete_nonexistent_trueque():
    client = APIClient()
    response = client.delete('/trueques/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_list_empty_trueques():
    from api.models import Trueque
    Trueque.objects.all().delete()
    client = APIClient()
    response = client.get('/trueques/')
    assert response.status_code == 200
    assert response.data == []

@pytest.mark.django_db
def test_publicacion_create_invalid():
    from api.models import CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='pubinv', password='pass', email='pubinv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    # Título muy corto
    response = client.post('/publicaciones/', {
        'titulo': 'a', 'publicacion': 'desc', 'usuario': user.id
    })
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_publicacion_update():
    from api.models import Publicacion, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='pubup', password='pass', email='pubup@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='PubUp', publicacion='desc', usuario=user
    )
    response = client.patch(f'/publicaciones/{publicacion.id}/', {'titulo': 'PubUpdated'})
    assert response.status_code in [200, 202]

@pytest.mark.django_db
def test_publicacion_delete():
    from api.models import Publicacion, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='pubdel', password='pass', email='pubdel@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='PubDel', publicacion='desc', usuario=user
    )
    response = client.delete(f'/publicaciones/{publicacion.id}/')
    assert response.status_code in [204, 200]
    # Intentar eliminar de nuevo
    response = client.delete(f'/publicaciones/{publicacion.id}/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_get_nonexistent_publicacion():
    client = APIClient()
    response = client.get('/publicaciones/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_update_nonexistent_publicacion():
    client = APIClient()
    response = client.patch('/publicaciones/99999/', {'titulo': 'NoExiste'})
    assert response.status_code == 404

@pytest.mark.django_db
def test_delete_nonexistent_publicacion():
    client = APIClient()
    response = client.delete('/publicaciones/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_list_empty_publicaciones():
    from api.models import Publicacion
    Publicacion.objects.all().delete()
    client = APIClient()
    response = client.get('/publicaciones/')
    assert response.status_code == 200
    assert response.data == []

@pytest.mark.django_db
def test_servicio_create_invalid():
    from api.models import CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='servinv', password='pass', email='servinv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    # Producto muy corto
    response = client.post('/servicios/', {
        'producto': 'a', 'contenido': 'desc', 'precio_producto': 100, 'monto_pagado': 500, 'usuario': user.id
    })
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_servicio_update():
    from api.models import Servicio, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='servup', password='pass', email='servup@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ServUp', contenido='desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    response = client.patch(f'/servicios/{servicio.id}/', {'producto': 'ServUpdated'})
    assert response.status_code in [200, 202]

@pytest.mark.django_db
def test_servicio_delete():
    from api.models import Servicio, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='servdel', password='pass', email='servdel@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ServDel', contenido='desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    response = client.delete(f'/servicios/{servicio.id}/')
    assert response.status_code in [204, 200]
    # Intentar eliminar de nuevo
    response = client.delete(f'/servicios/{servicio.id}/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_get_nonexistent_servicio():
    client = APIClient()
    response = client.get('/servicios/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_update_nonexistent_servicio():
    client = APIClient()
    response = client.patch('/servicios/99999/', {'producto': 'NoExiste'})
    assert response.status_code == 404

@pytest.mark.django_db
def test_delete_nonexistent_servicio():
    client = APIClient()
    response = client.delete('/servicios/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_list_empty_servicios():
    from api.models import Servicio
    Servicio.objects.all().delete()
    client = APIClient()
    response = client.get('/servicios/')
    assert response.status_code == 200
    assert response.data == []

@pytest.mark.django_db
def test_interaccion_publicacion_create_invalid():
    from api.models import CustomUser, Publicacion
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='ipubinv', password='pass', email='ipubinv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='IPubInv', publicacion='desc', usuario=user
    )
    # Comentario vacío
    response = client.post('/interacciones-publicacion/', {
        'publicacion': publicacion.id, 'usuario': user.id, 'comentario': '', 'me_gusta': True
    })
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_interaccion_publicacion_update():
    from api.models import InteraccionPublicacion, CustomUser, Publicacion
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='ipubup', password='pass', email='ipubup@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='IPubUp', publicacion='desc', usuario=user
    )
    inter = InteraccionPublicacion.objects.create(
        publicacion=publicacion, usuario=user, comentario='coment', me_gusta=True
    )
    response = client.patch(f'/interacciones-publicacion/{inter.id}/', {'comentario': 'editado'})
    assert response.status_code in [200, 202]

@pytest.mark.django_db
def test_interaccion_publicacion_delete():
    from api.models import InteraccionPublicacion, CustomUser, Publicacion
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='ipubdel', password='pass', email='ipubdel@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    publicacion = Publicacion.objects.create(
        titulo='IPubDel', publicacion='desc', usuario=user
    )
    inter = InteraccionPublicacion.objects.create(
        publicacion=publicacion, usuario=user, comentario='coment', me_gusta=True
    )
    response = client.delete(f'/interacciones-publicacion/{inter.id}/')
    assert response.status_code in [204, 200]
    # Intentar eliminar de nuevo
    response = client.delete(f'/interacciones-publicacion/{inter.id}/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_get_nonexistent_interaccion_publicacion():
    client = APIClient()
    response = client.get('/interacciones-publicacion/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_update_nonexistent_interaccion_publicacion():
    client = APIClient()
    response = client.patch('/interacciones-publicacion/99999/', {'comentario': 'NoExiste'})
    assert response.status_code == 404

@pytest.mark.django_db
def test_delete_nonexistent_interaccion_publicacion():
    client = APIClient()
    response = client.delete('/interacciones-publicacion/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_list_empty_interacciones_publicacion():
    from api.models import InteraccionPublicacion
    InteraccionPublicacion.objects.all().delete()
    client = APIClient()
    response = client.get('/interacciones-publicacion/')
    assert response.status_code == 200
    assert response.data == []

@pytest.mark.django_db
def test_interaccion_trueque_create_invalid():
    from api.models import CustomUser, Trueque, Categoria
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='itqinv', password='pass', email='itqinv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatITQInv')
    trueque = Trueque.objects.create(
        titulo='ITQInv', trueque='desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    # Comentario vacío
    response = client.post('/interacciones-trueque/', {
        'trueque': trueque.id, 'usuario': user.id, 'comentario': '', 'me_interesa': True
    })
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_interaccion_trueque_update():
    from api.models import InteraccionTrueque, CustomUser, Trueque, Categoria
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='itqup', password='pass', email='itqup@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatITQUp')
    trueque = Trueque.objects.create(
        titulo='ITQUp', trueque='desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    inter = InteraccionTrueque.objects.create(
        trueque=trueque, usuario=user, comentario='coment', me_interesa=True
    )
    response = client.patch(f'/interacciones-trueque/{inter.id}/', {'comentario': 'editado'})
    assert response.status_code in [200, 202]

@pytest.mark.django_db
def test_interaccion_trueque_delete():
    from api.models import InteraccionTrueque, CustomUser, Trueque, Categoria
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='itqdel', password='pass', email='itqdel@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    categoria = Categoria.objects.create(nombre='CatITQDel')
    trueque = Trueque.objects.create(
        titulo='ITQDel', trueque='desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad'
    )
    inter = InteraccionTrueque.objects.create(
        trueque=trueque, usuario=user, comentario='coment', me_interesa=True
    )
    response = client.delete(f'/interacciones-trueque/{inter.id}/')
    assert response.status_code in [204, 200]
    # Intentar eliminar de nuevo
    response = client.delete(f'/interacciones-trueque/{inter.id}/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_get_nonexistent_interaccion_trueque():
    client = APIClient()
    response = client.get('/interacciones-trueque/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_update_nonexistent_interaccion_trueque():
    client = APIClient()
    response = client.patch('/interacciones-trueque/99999/', {'comentario': 'NoExiste'})
    assert response.status_code == 404

@pytest.mark.django_db
def test_delete_nonexistent_interaccion_trueque():
    client = APIClient()
    response = client.delete('/interacciones-trueque/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_list_empty_interacciones_trueque():
    from api.models import InteraccionTrueque
    InteraccionTrueque.objects.all().delete()
    client = APIClient()
    response = client.get('/interacciones-trueque/')
    assert response.status_code == 200
    assert response.data == []

@pytest.mark.django_db
def test_publicidades_create_invalid():
    from api.models import Servicio, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='publiinv', password='pass', email='publiinv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProdPubliInv', contenido='Desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    # Precio negativo
    response = client.post('/publicidades/', {
        'precio_publicidad': -10, 'usuario': user.id, 'estado': 'activada', 'servicio': servicio.id
    })
    assert response.status_code in [400, 422]
    # Servicio inexistente
    response = client.post('/publicidades/', {
        'precio_publicidad': 100, 'usuario': user.id, 'estado': 'activada', 'servicio': 99999
    })
    assert response.status_code in [400, 422]
    # Usuario inexistente
    response = client.post('/publicidades/', {
        'precio_publicidad': 100, 'usuario': 99999, 'estado': 'activada', 'servicio': servicio.id
    })
    assert response.status_code in [400, 422]
    # Estado inválido
    response = client.post('/publicidades/', {
        'precio_publicidad': 100, 'usuario': user.id, 'estado': 'noexiste', 'servicio': servicio.id
    })
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_publicidades_update_invalid():
    from api.models import Publicidades, Servicio, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='publiupinv', password='pass', email='publiupinv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProdPubliUpInv', contenido='Desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    publi = Publicidades.objects.create(
        precio_publicidad=250, usuario=user, estado='activada', servicio=servicio, fecha_inicio=None
    )
    # Precio negativo
    response = client.patch(f'/publicidades/{publi.id}/', {'precio_publicidad': -1})
    assert response.status_code in [400, 422]
    # Estado inválido
    response = client.patch(f'/publicidades/{publi.id}/', {'estado': 'noexiste'})
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_publicidades_delete():
    from api.models import Publicidades, Servicio, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='publidel', password='pass', email='publidel@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    servicio = Servicio.objects.create(
        producto='ProdPubliDel', contenido='Desc', precio_producto=100, monto_pagado=500, usuario=user
    )
    publi = Publicidades.objects.create(
        precio_publicidad=250, usuario=user, estado='activada', servicio=servicio, fecha_inicio=None
    )
    response = client.delete(f'/publicidades/{publi.id}/')
    assert response.status_code in [204, 200]
    # Intentar eliminar de nuevo
    response = client.delete(f'/publicidades/{publi.id}/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_get_nonexistent_publicidades():
    client = APIClient()
    response = client.get('/publicidades/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_update_nonexistent_publicidades():
    client = APIClient()
    response = client.patch('/publicidades/99999/', {'precio_publicidad': 100})
    assert response.status_code == 404

@pytest.mark.django_db
def test_delete_nonexistent_publicidades():
    client = APIClient()
    response = client.delete('/publicidades/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_list_empty_publicidades():
    from api.models import Publicidades
    Publicidades.objects.all().delete()
    client = APIClient()
    response = client.get('/publicidades/')
    assert response.status_code == 200
    assert response.data == []

# CONTACTOS
@pytest.mark.django_db
def test_contactos_create_invalid():
    from api.models import CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='continv', password='pass', email='continv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    # Correo inválido
    response = client.post('/contactos/', {
        'usuario': user.id, 'correo': 'noemail', 'promocionarse': True, 'mensaje': 'Hola', 'leido': False
    })
    assert response.status_code in [400, 422]
    # Mensaje vacío
    response = client.post('/contactos/', {
        'usuario': user.id, 'correo': 'continv@example.com', 'promocionarse': True, 'mensaje': '', 'leido': False
    })
    assert response.status_code in [400, 422]
    # Usuario inexistente
    response = client.post('/contactos/', {
        'usuario': 99999, 'correo': 'continv@example.com', 'promocionarse': True, 'mensaje': 'Hola', 'leido': False
    })
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_contactos_update_invalid():
    from api.models import Contactos, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='contupinv', password='pass', email='contupinv@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    contacto = Contactos.objects.create(
        usuario=user, correo='contupinv@example.com', promocionarse=True, mensaje='Hola', leido=False
    )
    # Correo inválido
    response = client.patch(f'/contactos/{contacto.id}/', {'correo': 'noemail'})
    assert response.status_code in [400, 422]
    # Mensaje vacío
    response = client.patch(f'/contactos/{contacto.id}/', {'mensaje': ''})
    assert response.status_code in [400, 422]

@pytest.mark.django_db
def test_contactos_delete():
    from api.models import Contactos, CustomUser
    client = APIClient()
    user = CustomUser.objects.create_user(
        username='contdel', password='pass', email='contdel@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria'
    )
    contacto = Contactos.objects.create(
        usuario=user, correo='contdel@example.com', promocionarse=True, mensaje='Hola', leido=False
    )
    response = client.delete(f'/contactos/{contacto.id}/')
    assert response.status_code in [204, 200]
    # Intentar eliminar de nuevo
    response = client.delete(f'/contactos/{contacto.id}/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_get_nonexistent_contactos():
    client = APIClient()
    response = client.get('/contactos/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_update_nonexistent_contactos():
    client = APIClient()
    response = client.patch('/contactos/99999/', {'mensaje': 'NoExiste'})
    assert response.status_code == 404

@pytest.mark.django_db
def test_delete_nonexistent_contactos():
    client = APIClient()
    response = client.delete('/contactos/99999/')
    assert response.status_code == 404

@pytest.mark.django_db
def test_list_empty_contactos():
    from api.models import Contactos
    Contactos.objects.all().delete()
    client = APIClient()
    response = client.get('/contactos/')
    assert response.status_code == 200
    assert response.data == []