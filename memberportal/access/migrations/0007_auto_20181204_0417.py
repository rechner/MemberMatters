# Generated by Django 2.0.9 on 2018-12-03 18:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("access", "0006_auto_20181204_0106"),
    ]

    operations = [
        migrations.AlterField(
            model_name="accesscontrolleddevice",
            name="name",
            field=models.CharField(max_length=30, unique=True, verbose_name="Name"),
        ),
    ]
