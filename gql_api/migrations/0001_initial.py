# Generated by Django 3.0.7 on 2020-06-13 00:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Entity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tags', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='EntityType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('iso', models.CharField(max_length=3)),
                ('description', models.CharField(blank=True, max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='EntityRelation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_entity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_entity', to='gql_api.Entity')),
                ('from_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_type', to='gql_api.EntityType')),
                ('to_entity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='to_entity', to='gql_api.Entity')),
                ('to_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='to_type', to='gql_api.EntityType')),
            ],
        ),
        migrations.AddField(
            model_name='entity',
            name='relation',
            field=models.ManyToManyField(blank=True, through='gql_api.EntityRelation', to='gql_api.Entity'),
        ),
        migrations.AddField(
            model_name='entity',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.EntityType'),
        ),
    ]
