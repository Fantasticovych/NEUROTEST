from django.db import models
from django.contrib.auth.models import User

class Test(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.CharField(max_length=200)
    difficulty = models.CharField(max_length=50, default="medium")
    created_at = models.DateTimeField(auto_now_add=True)

    is_completed = models.BooleanField(default=False)
    correct_answers_count = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    percentage_score = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.topic} ({self.difficulty})"

class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="questions")
    question = models.TextField()
    correct_answer = models.CharField(max_length=255)
    incorrect_answers = models.JSONField()

    def __str__(self):
        return self.question

class TestResult(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="results")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    total_questions = models.IntegerField()
    completed_at = models.DateTimeField(auto_now_add=True)
    answers = models.JSONField(default=dict)

    class Meta:
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.user.username} - {self.test.topic} - {self.score}/{self.total_questions}"

    @property
    def percentage(self):
        return round((self.score / self.total_questions) * 100, 1)
