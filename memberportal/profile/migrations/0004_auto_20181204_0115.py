# Generated by Django 2.0.9 on 2018-12-03 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profile", "0003_auto_20181204_0106"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="can_see_members_logs",
            field=models.BooleanField(default=False, verbose_name="Can see member personal details"),
        ),
        migrations.AddField(
            model_name="profile",
            name="can_see_members_memberbucks",
            field=models.BooleanField(default=False, verbose_name="Can see member personal details"),
        ),
    ]
