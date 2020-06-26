# Generated by Django 3.0.7 on 2020-06-25 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gql_api', '0013_auto_20200625_1409'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='contentline',
            name='Entity_Unique_Language',
        ),
        migrations.AddField(
            model_name='entity',
            name='order',
            field=models.IntegerField(default=0),
        ),
        migrations.AddConstraint(
            model_name='contentline',
            constraint=models.UniqueConstraint(fields=('parent', 'language'), name='Entity_Unique_Content_Language'),
        ),
        migrations.AddConstraint(
            model_name='contentmeaning',
            constraint=models.UniqueConstraint(fields=('parent', 'language'), name='Entity_Unique_Content_Meaning_Language'),
        ),
        migrations.AddConstraint(
            model_name='entity',
            constraint=models.UniqueConstraint(fields=('default_text', 'type'), name='Entity_Unique_Text_Type'),
        ),
        migrations.AddConstraint(
            model_name='entitymeta',
            constraint=models.UniqueConstraint(fields=('parent', 'name'), name='Entity_Unique_MetaName'),
        ),
        migrations.AddConstraint(
            model_name='entityrelation',
            constraint=models.UniqueConstraint(fields=('from_entity', 'to_entity'), name='Entity_Unique_Relation'),
        ),
        migrations.AddConstraint(
            model_name='entitytext',
            constraint=models.UniqueConstraint(fields=('parent', 'language'), name='Entity_Unique_Text_Language'),
        ),
    ]
