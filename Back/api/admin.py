from django.contrib import admin
from .models import Servicio, Publicidades

@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    pass

@admin.register(Publicidades)
class PublicidadesAdmin(admin.ModelAdmin):
    readonly_fields = ("fecha_inicio", "fecha_fin")
    # Opcional: excluir fecha_fin del formulario si no quieres ni mostrarla
    # exclude = ("fecha_fin",)
