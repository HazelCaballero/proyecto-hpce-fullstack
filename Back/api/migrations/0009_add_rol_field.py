from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0008_contactos_leido'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='rol',
            field=models.CharField(
                max_length=20,
                choices=[
                    ('usuaria', 'Usuaria'),
                    ('moderador', 'Moderador'),
                    ('soporte', 'Soporte'),
                    ('superusuario', 'Superusuario'),
                ],
                default='usuaria',
            ),
        ),
    ]
