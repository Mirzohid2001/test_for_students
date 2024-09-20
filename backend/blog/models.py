from django.db import models
from django.utils import timezone
class Academy(models.Model):
    title = models.CharField(max_length=255)
    total = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'academy'
        verbose_name_plural = 'academies'


class Teacher(models.Model):
    name = models.CharField(max_length=255)
    teaching_course = models.CharField(max_length=255)
    academy = models.ForeignKey(Academy, related_name='teachers', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'teacher'
        verbose_name_plural = 'teachers'


class Group(models.Model):
    academy = models.ForeignKey(Academy, related_name='groups', on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, related_name='groups', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'group'
        verbose_name_plural = 'groups'


class User(models.Model):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    group = models.ForeignKey(Group, related_name='students', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'


class Checkpoints(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'checkpoint'
        verbose_name_plural = 'checkpoints'


class Questions(models.Model):
    text = models.CharField(max_length=255)
    checkpoint = models.ForeignKey(Checkpoints, related_name='questions', on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = 'question'
        verbose_name_plural = 'questions'


class Examinations(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    checkpoint = models.ForeignKey(Checkpoints, on_delete=models.CASCADE)
    total = models.FloatField(null=True, blank=True)
    passed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Examination {self.id} for user {self.user.id}"



class Result(models.Model):
    answer1 = models.FloatField(null=True, blank=True)
    answer2 = models.FloatField(null=True, blank=True)
    answer3 = models.FloatField(null=True, blank=True)
    answer4 = models.FloatField(null=True, blank=True)
    answer5 = models.FloatField(null=True, blank=True)
    answer6 = models.FloatField(null=True, blank=True)
    answer7 = models.FloatField(null=True, blank=True)
    answer8 = models.FloatField(null=True, blank=True)
    answer9 = models.FloatField(null=True, blank=True)
    answer10 = models.FloatField(null=True, blank=True)
    practics = models.FloatField(null=True, blank=True)
    practics_result = models.FloatField(null=True, blank=True)
    total = models.FloatField(null=True, blank=True)
    total_percentage = models.FloatField(null=True, blank=True)
    archived = models.BooleanField(default=False)
    examination = models.ForeignKey('Examinations', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question1 = models.ForeignKey('Questions', related_name='question1', on_delete=models.CASCADE)
    question2 = models.ForeignKey('Questions', related_name='question2', on_delete=models.CASCADE)
    question3 = models.ForeignKey('Questions', related_name='question3', on_delete=models.CASCADE)
    question4 = models.ForeignKey('Questions', related_name='question4', on_delete=models.CASCADE)
    question5 = models.ForeignKey('Questions', related_name='question5', on_delete=models.CASCADE)
    question6 = models.ForeignKey('Questions', related_name='question6', on_delete=models.CASCADE)
    question7 = models.ForeignKey('Questions', related_name='question7', on_delete=models.CASCADE)
    question8 = models.ForeignKey('Questions', related_name='question8', on_delete=models.CASCADE)
    question9 = models.ForeignKey('Questions', related_name='question9', on_delete=models.CASCADE)
    question10 = models.ForeignKey('Questions', related_name='question10', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if self.answer1 and self.answer2 and self.answer3 and self.answer4 and self.answer5 and self.answer6 and self.answer7 and self.answer8 and self.answer9 and self.answer10:
            self.total = (
                    self.answer1 + self.answer2 + self.answer3 + self.answer4 +
                    self.answer5 + self.answer6 + self.answer7 + self.answer8 +
                    self.answer9 + self.answer10
            )
        if self.total is not None:
            self.total_percentage = (self.total / 50) * 100
        super(Result, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.name} {self.user.surname} - {self.total_percentage}%'

    class Meta:
        verbose_name = 'result'
        verbose_name_plural = 'results'



class Retake(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, related_name='teacher', on_delete=models.CASCADE)
    total_percentage = models.FloatField()
    examination_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user

    class Meta:
        verbose_name = 'retake'
        verbose_name_plural = 'retakes'


class ConcursCheckpoint(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'concurs checkpoint'
        verbose_name_plural = 'concurs checkpoints'

class ConcursQuestion(models.Model):
    checkpoint = models.ForeignKey(ConcursCheckpoint, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = 'concurs question'
        verbose_name_plural = 'concurs questions'

class ConcursAnswer(models.Model):
    question = models.ForeignKey(ConcursQuestion, on_delete=models.CASCADE)
    text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = 'concurs answer'
        verbose_name_plural = 'concurs answers'

class ConcursUserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(ConcursQuestion, on_delete=models.CASCADE)
    answer = models.ForeignKey(ConcursAnswer, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.name} - {self.question.text}'

    class Meta:
        verbose_name = 'concurs user answer'
        verbose_name_plural = 'concurs user answers'

class ConcursResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    checkpoint = models.ForeignKey(ConcursCheckpoint, on_delete=models.CASCADE)
    total = models.FloatField(null=True, blank=True)
    total_percentage = models.FloatField(null=True, blank=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.name} {self.user.surname} - {self.total_percentage}%'

    @property
    def is_winner(self):
        correct_answers = ConcursUserAnswer.objects.filter(user=self.user, question__checkpoint=self.checkpoint, is_correct=True).count()
        max_correct_answers = ConcursUserAnswer.objects.filter(question__checkpoint=self.checkpoint, is_correct=True).values('user').annotate(total_correct=models.Count('id')).order_by('-total_correct').first()
        return correct_answers == max_correct_answers['total_correct'] if max_correct_answers else False

    class Meta:
        verbose_name = 'concurs result'
        verbose_name_plural = 'concurs results'

class FinalExamCheckpoint(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'final exam checkpoint'
        verbose_name_plural = 'final exam checkpoints'


class FinalExamQuestion(models.Model):
    checkpoint = models.ForeignKey(FinalExamCheckpoint, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = 'final exam question'
        verbose_name_plural = 'final exam questions'


class FinalExamination(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    concurs = models.ForeignKey(ConcursResult, on_delete=models.CASCADE, null=True, blank=True)
    checkpoint = models.ForeignKey(FinalExamCheckpoint, on_delete=models.CASCADE)
    total = models.FloatField(null=True, blank=True)
    total_percentage = models.FloatField(null=True, blank=True)
    archived = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'final examination'
        verbose_name_plural = 'final examinations'


class FinalExaminationResult(models.Model):
    answer1 = models.FloatField(null=True, blank=True)
    answer2 = models.FloatField(null=True, blank=True)
    answer3 = models.FloatField(null=True, blank=True)
    answer4 = models.FloatField(null=True, blank=True)
    answer5 = models.FloatField(null=True, blank=True)
    answer6 = models.FloatField(null=True, blank=True)
    answer7 = models.FloatField(null=True, blank=True)
    answer8 = models.FloatField(null=True, blank=True)
    answer9 = models.FloatField(null=True, blank=True)
    answer10 = models.FloatField(null=True, blank=True)
    total = models.FloatField(null=True, blank=True)
    total_percentage = models.FloatField(null=True, blank=True)
    archived = models.BooleanField(default=False)
    examination = models.ForeignKey(FinalExamination, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question1 = models.ForeignKey('FinalExamQuestion', related_name='FinalExamQuestion1', on_delete=models.CASCADE)
    question2 = models.ForeignKey('FinalExamQuestion', related_name='FinalExamQuestion2', on_delete=models.CASCADE)
    question3 = models.ForeignKey('FinalExamQuestion', related_name='FinalExamQuestion3', on_delete=models.CASCADE)
    question4 = models.ForeignKey('FinalExamQuestion', related_name='FinalExamQuestion4', on_delete=models.CASCADE)
    question5 = models.ForeignKey('FinalExamQuestion', related_name='FinalExamQuestion5', on_delete=models.CASCADE)
    question6 = models.ForeignKey('FinalExamQuestion', related_name='FinalExamQuestion6', on_delete=models.CASCADE)
    question7 = models.ForeignKey('FinalExamQuestion', related_name='FinalExamQuestion7', on_delete=models.CASCADE)
    question8 = models.ForeignKey('FinalExamQuestion', related_name='FinalExamQuestion8', on_delete=models.CASCADE)
    question9 = models.ForeignKey('FinalExamQuestion', related_name='FinalExamQuestion9', on_delete=models.CASCADE)
    question10 = models.ForeignKey('FinalExamQuestion', related_name='FinalExamQuestion10', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.name} {self.user.surname} - {self.total_percentage}%'


class RetakeFinalExam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    total_percentage = models.FloatField()
    examination_date = models.DateTimeField(auto_now_add=True)
    archived = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'retake final examination'
        verbose_name_plural = 'retake final examinations'


class News(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='news_images/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'news'
        verbose_name_plural = 'news'

class MasterClass(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    day = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'master class'
        verbose_name_plural = 'master classes'














