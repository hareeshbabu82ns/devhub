# Generated by Django 3.0.7 on 2020-06-19 14:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gql_api', '0007_auto_20200617_0342'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contentextras',
            name='entity',
        ),
        migrations.RemoveField(
            model_name='contentmeaning',
            name='entity',
        ),
        migrations.AlterField(
            model_name='contentextras',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.Entity'),
        ),
        migrations.AlterField(
            model_name='contentmeaning',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.Entity'),
        ),
    ]
