from django.db import models
from django.conf import settings
from django.db.models import Q


class ThreadManager(models.Manager):
    def by_user(self, user):
        qlookup = Q(user1=user, user1_archived=False) | Q(user2=user,
                                                            user2_archived=False)
        qlookup2 = Q(user1=user, user1_archived=False) & Q(user2=user,
                                                            user2_archived=False)
        qs = self.get_queryset().filter(qlookup).exclude(qlookup2).distinct()
        return qs

    def by_users(self, user_a, user_b):
        qlookup = Q(user1=user_a, user2=user_b) | Q(user1=user_b, user2=user_a)
        qs = self.get_queryset().filter(qlookup)
        return qs


class Thread(models.Model):
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
            related_name="user1")
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
            related_name="user2")
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    user1_archived = models.BooleanField(default=False)
    user2_archived = models.BooleanField(default=False)

    objects = ThreadManager()

    class Meta:
        ordering = ['-last_updated']

    def __str__(self):
        return "{} to {} : {}".format(self.user1.username,
                                        self.user2.username,
                                        self.last_updated)

    def is_user_allowed(self, user_pk):
        if self.user1.pk == user_pk or self.user2.pk == user_pk:
            return True
        return False

    def get_receiver_username(self, sender_pk):
        if self.user1.pk == sender_pk:
            return self.user2.username
        return self.user1.username

    def get_receiver_avatar(self, sender_pk):
        if self.user1.pk == sender_pk:
            return self.user2.avatar.url
        return self.user1.avatar.url
    


class ChatMessage(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, blank=True,
            null=True, related_name="thread")
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE, blank=True,
            null=True, related_name='chat_sender')
    timestamp = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=500)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return self.message[:20]

    def get_timestamp(self):
        return "{:%B %d, %Y, %I:%M %p}".format(self.timestamp)

    def receiver(self):
        if self.thread.user1 == self.user:
            return self.thread.user1
        else:
            return self.thread.user2

    @property
    def get_avatar(self):
        return self.user.avatar.url
