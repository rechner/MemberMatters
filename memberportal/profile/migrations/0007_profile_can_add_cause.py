# Generated by Django 2.0.9 on 2018-12-03 17:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profile", "0006_auto_20181204_0256"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="can_add_cause",
            field=models.BooleanField(default=False, verbose_name="Can add a cause"),
        ),
    ]
