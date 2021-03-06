# Generated by Django 3.0.7 on 2020-06-13 04:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gql_api', '0004_auto_20200613_0137'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContentLine',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.Language')),
            ],
        ),
        migrations.RenameField(
            model_name='entity',
            old_name='relation',
            new_name='relations',
        ),
        migrations.CreateModel(
            name='ContentMeaning',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('entity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.Entity')),
                ('language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.Language')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.ContentLine')),
            ],
        ),
        migrations.AddField(
            model_name='contentline',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.Entity'),
        ),
        migrations.CreateModel(
            name='ContentExtras',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('entity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.Entity')),
                ('language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.Language')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gql_api.ContentLine')),
            ],
        ),
    ]
