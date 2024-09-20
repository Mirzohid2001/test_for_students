from django.contrib import admin
from .models import Academy, Teacher, Group, User, Checkpoints, Questions, Examinations, Result ,Retake,FinalExamination,\
    FinalExaminationResult,FinalExamQuestion,FinalExamCheckpoint,RetakeFinalExam,News,ConcursCheckpoint,ConcursAnswer,ConcursQuestion,ConcursUserAnswer,ConcursResult
# Register your models here.
admin.site.register(Academy)
admin.site.register(Teacher)
admin.site.register(Group)
admin.site.register(User)
admin.site.register(Checkpoints)
admin.site.register(Questions)
admin.site.register(Examinations)
admin.site.register(Result)
admin.site.register(FinalExamination)
admin.site.register(FinalExaminationResult)
admin.site.register(FinalExamQuestion)
admin.site.register(FinalExamCheckpoint)
admin.site.register(Retake)
admin.site.register(RetakeFinalExam)
admin.site.register(News)
admin.site.register(ConcursCheckpoint)
admin.site.register(ConcursAnswer)
admin.site.register(ConcursQuestion)
class ConcursUserAnswerAdmin(admin.ModelAdmin):
    list_display = ('user', 'question', 'answer', 'is_correct')

admin.site.register(ConcursUserAnswer, ConcursUserAnswerAdmin)
admin.site.register(ConcursResult)

