from django.contrib import admin
from .models import Entity, EntityType, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning


@admin.register(Language)
class LanguageTypeAdmin(admin.ModelAdmin):
    list_display = ['iso', 'name', 'description']


@admin.register(EntityType)
class EntityTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']


@admin.register(Entity)
class EntityAdmin(admin.ModelAdmin):
    list_display = ['type', 'order',
                    'default_text', 'default_thumbnail', 'tags']


@admin.register(EntityRelation)
class EntityRelationAdmin(admin.ModelAdmin):
    list_display = ['from_entity', 'from_type', 'to_entity', 'to_type']


@admin.register(EntityText)
class EntityTextAdmin(admin.ModelAdmin):
    list_display = ['parent', 'type', 'language', 'text', 'description']


@admin.register(EntityMeta)
class EntityMetaAdmin(admin.ModelAdmin):
    list_display = ['parent', 'type', 'name', 'value']


@admin.register(ContentLine)
class ContentLineAdmin(admin.ModelAdmin):
    list_display = ['parent', 'language', 'content']


@admin.register(ContentMeaning)
class ContentMeaningAdmin(admin.ModelAdmin):
    list_display = ['parent', 'language', 'content']


@admin.register(ContentExtras)
class ContentExtrasAdmin(admin.ModelAdmin):
    list_display = ['parent', 'language', 'content']
