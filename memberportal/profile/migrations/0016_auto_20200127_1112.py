# Generated by Django 3.0.2 on 2020-01-27 01:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profile", "0015_merge_20200123_1926"),
    ]

    operations = [
        migrations.AlterField(
            model_name="log",
            name="logtype",
            field=models.CharField(choices=[("generic", "Generic log entry"), ("usage", "Generic usage access"), ("stripe", "Stripe related event"), ("memberbucks", "Memberbucks related event"), ("memberbucks", "Memberbucks related event"), ("profile", "Member profile edited"), ("interlock", "Interlock related event"), ("door", "Door related event"), ("email", "Email send event"), ("admin", "Generic admin event"), ("error", "Some event that causes an error"), ("xero", "Generic xero log entry")], max_length=30, verbose_name="Type of action/event"),
        ),
    ]
