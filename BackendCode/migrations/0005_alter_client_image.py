# Generated by Django 4.2.16 on 2024-09-26 19:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BackendCode', '0004_alter_client_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
    ]
