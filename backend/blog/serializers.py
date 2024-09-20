from django.shortcuts import get_object_or_404
from rest_framework import serializers
from .models import Academy, Teacher, Group, User, Checkpoints, Questions, Examinations, \
    Result, FinalExamination, FinalExaminationResult, FinalExamQuestion, FinalExamCheckpoint, RetakeFinalExam, News, \
    MasterClass, ConcursQuestion, ConcursCheckpoint


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    students = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = '__all__'


class AcademySerializer(serializers.ModelSerializer):
    class Meta:
        model = Academy
        fields = '__all__'


class TeacherSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = Teacher
        fields = '__all__'


class CheckpointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkpoints
        fields = ('id', 'title')


class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields = '__all__'


class ExaminationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examinations
        fields = '__all__'


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'
        extra_kwargs = {
            'answer1': {'required': False},
            'answer2': {'required': False},
            'answer3': {'required': False},
            'answer4': {'required': False},
            'answer5': {'required': False},
            'answer6': {'required': False},
            'answer7': {'required': False},
            'answer8': {'required': False},
            'answer9': {'required': False},
            'answer10': {'required': False},
            'question1': {'required': False},
            'question2': {'required': False},
            'question3': {'required': False},
            'question4': {'required': False},
            'question5': {'required': False},
            'question6': {'required': False},
            'question7': {'required': False},
            'question8': {'required': False},
            'question9': {'required': False},
            'question10': {'required': False},
        }

    def to_internal_value(self, data):
        internal_data = super().to_internal_value(data)
        for i in range(1, 11):
            question_key = f'question{i}'
            if question_key in data:
                question = get_object_or_404(Questions, id=data[question_key])
                internal_data[f'question{i}'] = question
        return internal_data


class RetakeFinalExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetakeFinalExam
        fields = '__all__'


class FinalExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalExamination
        fields = '__all__'


class FinalExamResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalExaminationResult
        fields = '__all__'


class FinalExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalExamQuestion
        fields = '__all__'


class FinalExamCheckpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalExamCheckpoint
        fields = '__all__'


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ('id', 'title', 'content', 'image')


class MasterClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterClass
        fields = ('id', 'title', 'content', 'teacher', 'day')

class ConcursQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConcursQuestion
        fields = '__all__'

class ConcurscheckpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConcursCheckpoint
        fields = ('id', 'title')
