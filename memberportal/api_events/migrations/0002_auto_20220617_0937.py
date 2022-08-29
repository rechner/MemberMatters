# Generated by Django 3.2.13 on 2022-06-16 23:37

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("api_events", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="event",
            name="date_updated_external",
        ),
        migrations.AddField(
            model_name="event",
            name="_created",
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name="event",
            name="_updated",
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
