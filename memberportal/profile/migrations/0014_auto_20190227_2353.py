# Generated by Django 2.1.5 on 2019-02-27 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profile", "0013_auto_20190227_2316"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="special_consideration_note",
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
    ]
