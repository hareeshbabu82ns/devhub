from django.db import models


class Language(models.Model):
    iso = models.CharField(max_length=3)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=50, blank=True, default='')

    def __str__(self):
        return self.description


class EntityType(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return self.name


class Entity(models.Model):
    default_text = models.CharField(max_length=50)
    default_thumbnail = models.URLField(
        default='https://via.placeholder.com/250?text=$text')
    type = models.ForeignKey('EntityType', on_delete=models.CASCADE)
    tags = models.TextField(blank=True, default='')
    order = models.IntegerField(default=0)
    relations = models.ManyToManyField(
        'Entity', blank=True, through='EntityRelation')

    class Meta:
        ordering = ['order', 'default_text']
        constraints = [
            models.UniqueConstraint(
                fields=['default_text', 'type'], name='Entity_Unique_Text_Type')
        ]

    def __str__(self):
        return f'{self.id} {self.type} {self.default_text}'


class EntityRelation(models.Model):
    from_entity = models.ForeignKey(
        'Entity', on_delete=models.CASCADE, related_name='from_entity')
    from_type = models.ForeignKey(
        'EntityType', on_delete=models.CASCADE, related_name='from_type')
    to_entity = models.ForeignKey(
        'Entity', on_delete=models.CASCADE, related_name='to_entity')
    to_type = models.ForeignKey(
        'EntityType', on_delete=models.CASCADE, related_name='to_type')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['from_entity', 'to_entity'], name='Entity_Unique_Relation')
        ]

    def __str__(self):
        return f'{self.from_entity} -> {self.to_entity}'


class EntityText(models.Model):
    parent = models.ForeignKey('Entity', on_delete=models.CASCADE)
    type = models.ForeignKey('EntityType', on_delete=models.CASCADE)
    language = models.ForeignKey('Language', on_delete=models.CASCADE)
    text = models.CharField(max_length=50)
    description = models.TextField(blank=True, default='')

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['parent', 'language'], name='Entity_Unique_Text_Language')
        ]

    def __str__(self):
        return f'{self.id} {self.language}'


class EntityMeta(models.Model):
    parent = models.ForeignKey('Entity', on_delete=models.CASCADE)
    type = models.ForeignKey('EntityType', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    value = models.TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['parent', 'name'], name='Entity_Unique_MetaName')
        ]

    def __str__(self):
        return f'{self.id} {self.name}'


class ContentLine(models.Model):
    parent = models.ForeignKey('Entity', on_delete=models.CASCADE)
    language = models.ForeignKey('Language', on_delete=models.CASCADE)
    content = models.TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['parent', 'language'], name='Entity_Unique_Content_Language')
        ]

    def __str__(self):
        return f'{self.id} {self.parent} {self.language}'


class ContentMeaning(models.Model):
    parent = models.ForeignKey('Entity', on_delete=models.CASCADE)
    language = models.ForeignKey('Language', on_delete=models.CASCADE)
    content = models.TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['parent', 'language'], name='Entity_Unique_Content_Meaning_Language')
        ]

    def __str__(self):
        return f'{self.id} {self.parent} {self.language}'


class ContentExtras(models.Model):
    parent = models.ForeignKey('Entity', on_delete=models.CASCADE)
    language = models.ForeignKey('Language', on_delete=models.CASCADE)
    content = models.TextField()

    def __str__(self):
        return f'{self.id} {self.parent} {self.language}'
