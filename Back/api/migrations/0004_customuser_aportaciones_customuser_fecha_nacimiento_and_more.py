# Generated by Django 5.2 on 2025-05-27 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_customuser_aportaciones_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='aportaciones',
            field=models.TextField(default='texto'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customuser',
            name='fecha_nacimiento',
            field=models.DateField(default='2003-09-07'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customuser',
            name='imagen_url',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='intereses',
            field=models.TextField(default='TEXTO'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customuser',
            name='telefono',
            field=models.CharField(default='911', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customuser',
            name='ubicacion',
            field=models.CharField(default='por ahi', max_length=80),
            preserve_default=False,
        ),
    ]
