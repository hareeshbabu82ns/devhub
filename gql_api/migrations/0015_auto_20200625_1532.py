# Generated by Django 3.0.7 on 2020-06-25 15:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gql_api', '0014_auto_20200625_1426'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='entity',
            options={'ordering': ['order', 'default_text']},
        ),
    ]