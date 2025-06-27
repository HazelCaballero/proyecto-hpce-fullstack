from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import CustomUser, Categoria, Trueque, Publicacion, Servicio, Publicidades, Contactos

class UrlsTestCase(APITestCase):
    def test_all_url_patterns(self):
        url_names = [
            'usuarios-listar-crear',
            'categorias-listar-crear',
            'trueques-listar-crear',
            'publicaciones-listar-crear',
            'interacciones-publicacion-listar-crear',
            'servicios-listar-crear',
            'interacciones-trueque-listar-crear',
            'publicidades-listar-crear',
            'contactos-listar-crear',
        ]
        for name in url_names:
            url = reverse(name)
            response = self.client.get(url)
            self.assertIn(response.status_code, [200, 401, 403])  # Puede requerir autenticación

    def test_detail_url_patterns(self):
        # Crear instancias para obtener IDs
        user = CustomUser.objects.create_user(username='urluser', password='pass', email='urluser@example.com', telefono='12345678', fecha_nacimiento='2000-01-01', intereses='i', aportaciones='a', ubicacion='Ciudad', rol='usuaria')
        categoria = Categoria.objects.create(nombre='UrlCat')
        trueque = Trueque.objects.create(titulo='TQ', trueque='desc', usuario=user, estado='pendiente', categoria=categoria, ubicacion='Ciudad')
        publicacion = Publicacion.objects.create(titulo='Pub', publicacion='desc', usuario=user)
        servicio = Servicio.objects.create(producto='Prod', contenido='desc', precio_producto=100, monto_pagado=500, usuario=user)
        publi = Publicidades.objects.create(precio_publicidad=250, usuario=user, estado='activada', servicio=servicio, fecha_inicio=None)
        contacto = Contactos.objects.create(usuario=user, correo='urluser@example.com', promocionarse=True, mensaje='Hola', leido=False)
        detail_urls = [
            reverse('usuarios-detalle', args=[user.id]),
            reverse('categorias-detalle', args=[categoria.id]),
            reverse('trueques-detalle', args=[trueque.id]),
            reverse('publicaciones-detalle', args=[publicacion.id]),
            reverse('servicios-detalle', args=[servicio.id]),
            reverse('publicidades-detalle', args=[publi.id]),
            reverse('contactos-detalle', args=[contacto.id]),
        ]
        for url in detail_urls:
            response = self.client.get(url)
            self.assertIn(response.status_code, [200, 401, 403])

    def test_nonexistent_url_returns_404(self):
        response = self.client.get('/no-existe-esta-url/')
        self.assertEqual(response.status_code, 404)

    def test_method_not_allowed(self):
        url = reverse('usuarios-listar-crear')
        response = self.client.put(url, {})
        self.assertIn(response.status_code, [405, 401, 403])