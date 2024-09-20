from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Academy, Teacher, Group, User, Checkpoints, Questions, Examinations, Result, Retake, \
    FinalExamination, FinalExaminationResult, FinalExamQuestion, FinalExamCheckpoint, RetakeFinalExam, News, \
    MasterClass, ConcursCheckpoint, ConcursUserAnswer, ConcursQuestion, ConcursAnswer, ConcursResult
from .serializers import AcademySerializer, TeacherSerializer, GroupSerializer, UserSerializer, CheckpointsSerializer, \
    QuestionsSerializer, ExaminationsSerializer, ResultSerializer, FinalExamResultSerializer, \
    FinalExamQuestionSerializer, FinalExamCheckpointSerializer, NewsSerializer, MasterClassSerializer, \
    ConcursQuestionSerializer, ConcurscheckpointSerializer
import random
from django.db.models import Count, Q
import logging


class AcademyList(APIView):
    def get(self, request):
        academies = Academy.objects.all()
        serializer = AcademySerializer(academies, many=True)
        return Response(serializer.data)


class AcademyDetail(APIView):
    def get(self, request, pk):
        academy = get_object_or_404(Academy, pk=pk)
        serializer = AcademySerializer(academy)
        return Response(serializer.data)


class TeacherList(APIView):
    def get(self, request):
        teachers = Teacher.objects.all()
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)


class TeacherDetail(APIView):
    def get(self, request, pk):
        teacher = get_object_or_404(Teacher, pk=pk)
        serializer = TeacherSerializer(teacher)
        return Response(serializer.data)


class GroupList(APIView):
    def get(self, request):
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)


class FinalExamGroupUsersView(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        users = group.students.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class GroupDetailView(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        checkpoint_id = request.query_params.get('checkpoint_id')
        if not checkpoint_id:
            return Response({"error": "Checkpoint ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        checkpoint = get_object_or_404(Checkpoints, id=checkpoint_id)
        students = group.students.all()
        student_data = []

        for student in students:
            results = Result.objects.filter(user=student, examination__group=group, examination__checkpoint=checkpoint,
                                            archived=False)
            if results.exists():
                total_percentage_all = sum([r.total_percentage for r in results])
                average_percentage = total_percentage_all / results.count()
            else:
                average_percentage = 0

            student_data.append({
                'student_id': student.id,
                'student_name': f'{student.name} {student.surname}',
                'average_percentage': average_percentage,
                'exam_taken': results.exists()
            })

        response_data = {
            'group_name': group.title,
            'teacher_name': group.teacher.name,
            'academy_name': group.academy.title,
            'students': student_data,
            'all_exams_completed': all(student['exam_taken'] for student in student_data)
        }
        return Response(response_data, status=status.HTTP_200_OK)


class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserDetail(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        checkpoint_id = request.query_params.get('checkpoint_id')

        if not checkpoint_id:
            return Response({"error": "Checkpoint ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        checkpoint = get_object_or_404(Checkpoints, id=checkpoint_id)
        group = user.group
        teacher = group.teacher
        results = Result.objects.filter(examination__user=user, examination__checkpoint=checkpoint, archived=False)

        if results.exists():
            total_percentage_all = sum([r.total_percentage for r in results])
            total_percentage = total_percentage_all / results.count()
        else:
            total_percentage = 0

        data = {
            'user_name': f'{user.name} {user.surname}',
            'group_name': group.title,
            'teacher_name': teacher.name,
            'total_percentage': total_percentage
        }
        return Response(data, status=status.HTTP_200_OK)


class CheckpointListView(APIView):
    def get(self, request):
        checkpoints = Checkpoints.objects.all()
        checkpoint_data = [{'id': checkpoint.id, 'title': checkpoint.title} for checkpoint in checkpoints]
        return Response(checkpoint_data, status=status.HTTP_200_OK)


class QuestionsList(APIView):
    def get(self, request):
        questions = Questions.objects.all()
        serializer = QuestionsSerializer(questions, many=True)
        return Response(serializer.data)


class ExaminationList(APIView):
    def get(self, request):
        examinations = Examinations.objects.all()
        serializer = ExaminationsSerializer(examinations, many=True)
        return Response(serializer.data)


class ExaminationDetail(APIView):
    def get(self, request, pk):
        examination = get_object_or_404(Examinations, pk=pk)
        serializer = ExaminationsSerializer(examination)
        return Response(serializer.data)


class ResultList(APIView):
    def get(self, request):
        results = Result.objects.all()
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)


class StartExamination(APIView):
    def get(self, request, user_id, group_id):
        checkpoint_id = request.query_params.get('checkpoint_id')
        if not checkpoint_id:
            return Response({"error": "Checkpoint ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)
        group = get_object_or_404(Group, id=group_id)
        checkpoint = get_object_or_404(Checkpoints, id=checkpoint_id)

        questions = list(Questions.objects.filter(checkpoint=checkpoint, is_active=True))
        random_questions = random.sample(questions, 10)
        question_serializer = QuestionsSerializer(random_questions, many=True)
        return Response(question_serializer.data)

    def post(self, request, user_id, group_id):
        user = get_object_or_404(User, id=user_id)
        group = get_object_or_404(Group, id=group_id)
        checkpoint_id = request.data.get('checkpoint_id')
        checkpoint = get_object_or_404(Checkpoints, id=checkpoint_id)
        data = request.data
        total_score = 0

        question_answers = [(key, value) for key, value in data.items() if key.startswith('question')]
        total_questions = len(question_answers)
        if total_questions == 0:
            return Response({"error": "No questions provided"}, status=status.HTTP_400_BAD_REQUEST)

        max_score = total_questions * 5
        for question_key, answer in question_answers:
            total_score += float(answer)

        total_percentage = (total_score / max_score) * 100

        examination, created = Examinations.objects.get_or_create(user=user, group=group, checkpoint=checkpoint)

        old_results = Result.objects.filter(examination=examination, user=user, archived=False)
        for result in old_results:
            result.archived = True
            result.save()

        result_data = {
            'examination': examination.id,
            'user': user.id,
            'total': total_score,
            'total_percentage': total_percentage,
            'archived': False,
        }
        for index, (question_key, answer) in enumerate(question_answers):
            question_id = int(question_key.replace('question', ''))
            question = get_object_or_404(Questions, id=question_id)
            result_data[f'question{index + 1}'] = question.id
            result_data[f'answer{index + 1}'] = answer

        result_serializer = ResultSerializer(data=result_data)
        if result_serializer.is_valid():
            result_serializer.save()
        else:
            return Response(result_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        results = Result.objects.filter(examination__group=group, archived=False)
        if results.exists():
            total_percentage_all = sum([r.total_percentage for r in results])
            average_percentage = total_percentage_all / results.count()
        else:
            average_percentage = 0

        response_data = {
            'total_percentage': total_percentage,
            'total_score': total_score,
            'average_percentage': average_percentage
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class GroupExamsStatus(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        students = group.students.all()
        all_exams_completed = all(
            Examinations.objects.filter(user=student, group=group).exists() for student in students)
        return Response({'all_exams_completed': all_exams_completed}, status=status.HTTP_200_OK)


class RetakeExam(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        retakes = Result.objects.filter(total_percentage__lt=70, examination__group=group, archived=False)
        retake_data = [
            {
                'student_name': f"{result.user.name} {result.user.surname}",
                'group_name': result.examination.group.title,
                'teacher_name': result.examination.group.teacher.name,
                'percentage': result.total_percentage,
                'user_id': result.user.id,
            }
            for result in retakes
        ]
        return Response(retake_data)

    def post(self, request, user_id, group_id):
        user = get_object_or_404(User, id=user_id)
        group = get_object_or_404(Group, id=group_id)
        checkpoint_id = request.data.get('checkpoint_id')
        checkpoint = get_object_or_404(Checkpoints, id=checkpoint_id)
        data = request.data
        total_score = 0

        question_answers = [(key, value) for key, value in data.items() if key.startswith('question')]
        total_questions = len(question_answers)
        if total_questions == 0:
            return Response({"error": "No questions provided"}, status=status.HTTP_400_BAD_REQUEST)

        max_score = total_questions * 5
        for question_key, answer in question_answers:
            question_id = int(question_key.replace('question', ''))
            question = get_object_or_404(Questions, id=question_id)
            total_score += float(answer)

        total_percentage = (total_score / max_score) * 100

        examination, created = Examinations.objects.get_or_create(user=user, group=group, checkpoint=checkpoint)

        old_results = Result.objects.filter(examination=examination, user=user, archived=False)
        for result in old_results:
            result.archived = True
            result.save()

        result = Result.objects.create(
            examination=examination,
            user=user,
            total=total_score,
            total_percentage=total_percentage,
            archived=False
        )

        for question_key, answer in question_answers:
            question_id = int(question_key.replace('question', ''))
            question = get_object_or_404(Questions, id=question_id)
            setattr(result, f'question{question_id}', question)
            setattr(result, f'answer{question_id}', answer)
        result.save()

        results = Result.objects.filter(examination__group=group, archived=False)
        if results.exists():
            total_percentage_all = sum([r.total_percentage for r in results])
            average_percentage = total_percentage_all / results.count()
        else:
            average_percentage = 0

        response_data = {
            'total_percentage': total_percentage,
            'total_score': total_score,
            'average_percentage': average_percentage
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class GroupAverage(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        checkpoint_id = request.query_params.get('checkpoint_id')

        if not checkpoint_id:
            return Response({"error": "Checkpoint ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        checkpoint = get_object_or_404(Checkpoints, id=checkpoint_id)
        results = Result.objects.filter(examination__group=group, examination__checkpoint=checkpoint)

        if results.exists():
            total_percentage = sum([result.total_percentage for result in results])
            average_percentage = total_percentage / results.count()
        else:
            average_percentage = 0

        return Response(
            {'group_id': group_id, 'checkpoint_id': checkpoint_id, 'average_percentage': average_percentage})


class TeacherDetailView(APIView):
    def get(self, request, teacher_id):
        teacher = get_object_or_404(Teacher, id=teacher_id)
        checkpoint_id = request.query_params.get('checkpoint_id')
        if not checkpoint_id:
            return Response({"error": "Checkpoint ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        checkpoint = get_object_or_404(Checkpoints, id=checkpoint_id)
        groups = Group.objects.filter(teacher=teacher)
        group_data = []
        group_averages = []

        for group in groups:
            results = Result.objects.filter(examination__group=group, examination__checkpoint=checkpoint,
                                            archived=False)
            if results.exists():
                total_percentage_all = sum([r.total_percentage for r in results])
                average_percentage = total_percentage_all / results.count()
                group_averages.append(average_percentage)
            else:
                average_percentage = 0

            students = User.objects.filter(group=group)
            student_data = []
            for student in students:
                student_results = Result.objects.filter(user=student, examination__group=group,
                                                        examination__checkpoint=checkpoint, archived=False)
                if student_results.exists():
                    student_total_percentage_all = sum([r.total_percentage for r in student_results])
                    student_average_percentage = student_total_percentage_all / student_results.count()
                else:
                    student_average_percentage = 0

                student_data.append({
                    'student_id': student.id,
                    'student_name': f'{student.name} {student.surname}',
                    'average_percentage': student_average_percentage
                })

            group_data.append({
                'group_id': group.id,
                'group_name': group.title,
                'students': student_data,
                'average_percentage': average_percentage
            })

        if group_averages:
            overall_average = sum(group_averages) / len(group_averages)
        else:
            overall_average = 0

        response_data = {
            'teacher_name': f'{teacher.name}',
            'groups': group_data,
            'overall_average': overall_average
        }
        return Response(response_data, status=status.HTTP_200_OK)


class AcademyDetailView(APIView):
    def get(self, request, academy_id):
        academy = get_object_or_404(Academy, id=academy_id)
        checkpoint_id = request.query_params.get('checkpoint_id')
        if not checkpoint_id:
            return Response({"error": "Checkpoint ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        checkpoint = get_object_or_404(Checkpoints, id=checkpoint_id)
        groups = Group.objects.filter(academy=academy)
        group_data = []
        group_averages = []
        overall_averages = []

        for group in groups:
            group_results = Result.objects.filter(examination__group=group, examination__checkpoint=checkpoint,
                                                  archived=False)
            if group_results.exists():
                group_total_percentage_all = sum([r.total_percentage for r in group_results])
                group_average_percentage = group_total_percentage_all / group_results.count()
                group_averages.append(group_average_percentage)
            else:
                group_average_percentage = 0

            students = User.objects.filter(group=group)
            student_data = []
            for student in students:
                exam_taken = Examinations.objects.filter(user=student, group=group, checkpoint=checkpoint).exists()
                if exam_taken:
                    student_results = Result.objects.filter(user=student, examination__group=group,
                                                            examination__checkpoint=checkpoint, archived=False)
                    if student_results.exists():
                        student_total_percentage_all = sum([r.total_percentage for r in student_results])
                        student_average_percentage = student_total_percentage_all / student_results.count()
                    else:
                        student_average_percentage = 0
                else:
                    student_average_percentage = "Exam not taken"

                student_data.append({
                    'student_id': student.id,
                    'student_name': f'{student.name} {student.surname}',
                    'exam_taken': exam_taken,
                    'average_percentage': student_average_percentage
                })

            group_data.append({
                'group_id': group.id,
                'group_name': group.title,
                'students': student_data,
                'group_average_percentage': group_average_percentage
            })

            overall_averages.extend(group_averages)

        if overall_averages:
            overall_academy_average = sum(overall_averages) / len(overall_averages)
        else:
            overall_academy_average = 0

        response_data = {
            'academy_name': academy.title,
            'groups': group_data,
            'overall_academy_average': overall_academy_average
        }
        return Response(response_data, status=status.HTTP_200_OK)


class ConcursGroupList(APIView):
    def get(self, request):
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConcursCheckpointList(APIView):
    def get(self, request):
        checkpoints = ConcursCheckpoint.objects.all()
        serializer = ConcurscheckpointSerializer(checkpoints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConcursUserList(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        users = User.objects.filter(group=group)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConcursCheckpointQuestionsAPIView(APIView):
    def get(self, request, checkpoint_id):
        questions = ConcursQuestion.objects.filter(checkpoint_id=checkpoint_id)
        serializer = ConcursQuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubmitConcursAnswer(APIView):
    def post(self, request, user_id, question_id):
        logging.debug(f'Received POST request for user_id={user_id}, question_id={question_id}, data={request.data}')

        user = get_object_or_404(User, id=user_id)
        question = get_object_or_404(ConcursQuestion, id=question_id)
        answer_id = request.data.get('answer_id')
        logging.debug(f'Fetching answer with id={answer_id} for question id={question_id}')
        try:
            answer = ConcursAnswer.objects.get(id=answer_id, question=question)
        except ConcursAnswer.DoesNotExist:
            logging.error(f'Answer with id={answer_id} for question id={question_id} not found')
            return Response({'detail': 'No ConcursAnswer matches the given query.'}, status=status.HTTP_404_NOT_FOUND)

        logging.debug(f'Answer found: {answer}')

        is_correct = answer.is_correct
        logging.debug(f'Answer is correct: {is_correct}')
        user_answer = ConcursUserAnswer.objects.create(
            user=user,
            question=question,
            answer=answer,
            is_correct=is_correct
        )

        logging.debug(f'Successfully created user answer')
        checkpoint = question.checkpoint
        concurs_result, created = ConcursResult.objects.get_or_create(
            user=user,
            checkpoint=checkpoint,
            defaults={'total': 0, 'total_percentage': 0, 'archived': False}
        )
        correct_answers = ConcursUserAnswer.objects.filter(user=user, question__checkpoint=checkpoint,
                                                           is_correct=True).count()
        total_questions = ConcursQuestion.objects.filter(checkpoint=checkpoint).count()

        if total_questions > 0:
            total_percentage = (correct_answers / total_questions) * 100
        else:
            total_percentage = 0

        concurs_result.total = correct_answers
        concurs_result.total_percentage = total_percentage
        concurs_result.save()

        return Response({'is_correct': is_correct}, status=status.HTTP_201_CREATED)


class ConcursResultsAPIView(APIView):
    def get(self, request, checkpoint_id):
        checkpoint = get_object_or_404(ConcursCheckpoint, id=checkpoint_id)
        results = ConcursUserAnswer.objects.filter(question__checkpoint=checkpoint)

        user_scores = results.values('user').annotate(total_correct=Count('id', filter=Q(is_correct=True)))

        sorted_results = sorted(user_scores, key=lambda x: x['total_correct'], reverse=True)
        winners = [result for result in sorted_results if result['total_correct'] == sorted_results[0]['total_correct']]

        winners_data = [
            {
                'user_id': winner['user'],
                'total_correct': winner['total_correct']
            }
            for winner in winners
        ]

        return Response(winners_data, status=status.HTTP_200_OK)


class ConcursWinnerAPIView(APIView):
    def get(self, request, checkpoint_id=None):
        if checkpoint_id:
            checkpoint = get_object_or_404(ConcursCheckpoint, id=checkpoint_id)
            results = ConcursUserAnswer.objects.filter(question__checkpoint=checkpoint)
        else:
            results = ConcursUserAnswer.objects.all()

        user_scores = results.values('user').annotate(total_correct=Count('id', filter=Q(is_correct=True)))

        if not user_scores:
            return Response({'detail': 'No participants found.'}, status=status.HTTP_404_NOT_FOUND)

        sorted_results = sorted(user_scores, key=lambda x: x['total_correct'], reverse=True)
        winners = [result for result in sorted_results if result['total_correct'] == sorted_results[0]['total_correct']]

        winners_data = [
            {
                'user_id': winner['user'],
                'total_correct': winner['total_correct']
            }
            for winner in winners
        ]

        return Response(winners_data, status=status.HTTP_200_OK)


class FinalExamCheckpointList(APIView):
    def get(self, request):
        checkpoints = FinalExamCheckpoint.objects.all()
        checkpoint_data = [{'id': checkpoint.id, 'title': checkpoint.title} for checkpoint in checkpoints]
        return Response(checkpoint_data, status=status.HTTP_200_OK)


class FinalExamQuestionList(APIView):
    def get(self, request, checkpoint_id):
        checkpoint = get_object_or_404(FinalExamCheckpoint, id=checkpoint_id)
        questions = FinalExamQuestion.objects.filter(checkpoint=checkpoint, is_active=True)
        serializer = FinalExamQuestionSerializer(questions, many=True)
        return Response(serializer.data)


class FinalExamGroupUsersView(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        students = group.students.all()
        student_data = []

        for student in students:
            results = FinalExaminationResult.objects.filter(user=student, examination__group=group, archived=False)
            if results.exists():
                total_percentage_all = sum([r.total_percentage for r in results])
                average_percentage = total_percentage_all / results.count()
            else:
                average_percentage = 0

            student_data.append({
                'student_id': student.id,
                'student_name': f'{student.name} {student.surname}',
                'average_percentage': average_percentage,
                'exam_taken': results.exists()
            })

        response_data = {
            'group_name': group.title,
            'teacher_name': group.teacher.name,
            'academy_name': group.academy.title,
            'students': student_data,
            'all_exams_completed': all(student['exam_taken'] for student in student_data)
        }
        return Response(response_data, status=status.HTTP_200_OK)


class FinalExamGroupDetailView(APIView):
    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        students = group.students.all()
        student_data = []

        for student in students:
            exam_taken = FinalExamination.objects.filter(user=student, group=group).exists()
            percentage = None
            if exam_taken:
                final_exam = FinalExamination.objects.filter(user=student, group=group).latest('id')
                percentage = final_exam.total_percentage

            student_data.append({
                'student_id': student.id,
                'student_name': f'{student.name} {student.surname}',
                'exam_taken': exam_taken,
                'percentage': percentage
            })

        response_data = {
            'group_name': group.title,
            'teacher_name': group.teacher.name,
            'academy_name': group.academy.title,
            'students': student_data
        }
        return Response(response_data, status=status.HTTP_200_OK)


class FinalExamStartAPIView(APIView):
    def get(self, request, user_id, group_id):
        user = get_object_or_404(User, id=user_id)
        group = get_object_or_404(Group, id=group_id)
        checkpoints = FinalExamCheckpoint.objects.all()
        checkpoints_data = [{'id': checkpoint.id, 'title': checkpoint.title} for checkpoint in checkpoints]
        return Response(checkpoints_data, status=status.HTTP_200_OK)

    def post(self, request, user_id, group_id):
        user = get_object_or_404(User, id=user_id)
        group = get_object_or_404(Group, id=group_id)
        checkpoint_id = request.data.get('checkpoint_id')
        checkpoint = get_object_or_404(FinalExamCheckpoint, id=checkpoint_id)

        questions = list(FinalExamQuestion.objects.filter(checkpoint=checkpoint, is_active=True))
        random_questions = random.sample(questions, 10)
        question_serializer = QuestionsSerializer(random_questions, many=True)
        overall_score = Result.objects.filter(user=user, archived=False).aggregate(Avg('total_percentage'))[
                            'total_percentage__avg'] or 0
        response_data = {
            'questions': question_serializer.data,
            'overall_score': overall_score
        }
        return Response(response_data, status=status.HTTP_200_OK)


class FinalExamSubmit(APIView):
    def post(self, request, user_id, group_id):
        user = get_object_or_404(User, id=user_id)
        group = get_object_or_404(Group, id=group_id)
        checkpoint_id = request.data.get('checkpoint_id')
        checkpoint = get_object_or_404(FinalExamCheckpoint, id=checkpoint_id)
        data = request.data
        total_score = 0

        question_answers = [(key, value) for key, value in data.items() if key.startswith('answer')]
        total_questions = len(question_answers)
        if total_questions == 0:
            return Response({"error": "No questions provided"}, status=status.HTTP_400_BAD_REQUEST)

        max_score = total_questions * 5
        for question_key, answer in question_answers:
            total_score += float(answer)

        total_percentage = (total_score / max_score) * 100
        checkpoints_results = Result.objects.filter(user=user, archived=False)
        if checkpoints_results.exists():
            total_checkpoints_score = sum([result.total_percentage for result in checkpoints_results])
            average_checkpoints_percentage = (total_checkpoints_score / checkpoints_results.count()) * 0.56
        else:
            average_checkpoints_percentage = 0

        concours_results = ConcursResult.objects.filter(user=user, archived=False)
        additional_score = sum(2 for result in concours_results if result.is_winner)
        additional_percentage = additional_score
        final_percentage = total_percentage * 0.30

        final_total = average_checkpoints_percentage + additional_percentage + final_percentage

        final_exam = FinalExamination.objects.create(
            user=user,
            group=group,
            checkpoint=checkpoint,
            total=total_score,
            total_percentage=final_total
        )

        final_exam_result = FinalExaminationResult(
            user=user,
            examination=final_exam,
            total=total_score,
            total_percentage=total_percentage
        )

        for i, (question_key, answer) in enumerate(question_answers, 1):
            question_id = request.data.get(f'question{i}_id')
            question = get_object_or_404(FinalExamQuestion, id=question_id)
            setattr(final_exam_result, f'question{i}', question)
            setattr(final_exam_result, f'answer{i}', float(answer))

        final_exam_result.save()

        result_message = "Passed" if final_total >= 70 else "Failed - Retake Required"

        if final_total < 70:
            RetakeFinalExam.objects.create(
                user=user,
                group=group,
                teacher=group.teacher,
                total_percentage=final_total
            )

        response_data = {
            'user_id': user.id,
            'final_total': final_total,
            'result': result_message
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class FinalExamRetakeListView(APIView):
    def get(self, request):
        retakes = RetakeFinalExam.objects.filter(total_percentage__lt=70)
        retake_data = [
            {
                'student_name': f"{retake.user.name} {retake.user.surname}",
                'group_name': retake.group.title,
                'teacher_name': retake.group.teacher.name,
                'percentage': retake.total_percentage,
                'user_id': retake.user.id,
                'group_id': retake.group.id
            }
            for retake in retakes
        ]
        return Response(retake_data, status=status.HTTP_200_OK)


class RetakeFinalExamAPIView(APIView):
    def post(self, request, user_id, group_id):
        user = get_object_or_404(User, id=user_id)
        group = get_object_or_404(Group, id=group_id)
        data = request.data
        checkpoint_id = data.get('checkpoint_id')
        if not checkpoint_id:
            return Response({"error": "Checkpoint ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        checkpoint = get_object_or_404(FinalExamCheckpoint, id=checkpoint_id)

        answers = []
        total_score = 0
        for i in range(1, 11):
            answer = data.get(f'answer{i}')
            if answer is not None:
                answers.append(float(answer))
                total_score += float(answer)
        if len(answers) != 10:
            return Response({"error": "All answers must be provided"}, status=status.HTTP_400_BAD_REQUEST)

        question_ids = []
        for i in range(1, 11):
            question_id = data.get(f'question{i}_id')
            question_ids.append(question_id)

        if None in question_ids:
            return Response({"error": "All question IDs must be provided"}, status=status.HTTP_400_BAD_REQUEST)

        total_percentage = (total_score / 50) * 100

        concurs_results = ConcursResult.objects.filter(user=user, archived=False)
        additional_score = sum([2 for result in concurs_results if result.is_winner])

        final_total = total_percentage + additional_score
        final_exam = FinalExamination.objects.create(
            user=user,
            group=group,
            checkpoint=checkpoint,
            total=total_score,
            total_percentage=final_total,
            archived=False
        )

        final_exam_result = FinalExaminationResult(
            user=user,
            examination=final_exam,
            total=total_score,
            total_percentage=total_percentage,
            archived=False
        )

        for i, answer in enumerate(answers, 1):
            setattr(final_exam_result, f'answer{i}', answer)
            question = get_object_or_404(FinalExamQuestion, id=question_ids[i - 1])
            setattr(final_exam_result, f'question{i}', question)

        final_exam_result.save()
        result_message = "Passed" if final_total >= 70 else "Failed - Retake Required"
        if final_total >= 70:
            retake_exam = RetakeFinalExam.objects.filter(user=user, group=group, total_percentage__lt=70,
                                                         archived=False).first()
            if retake_exam:
                retake_exam.archived = True
                retake_exam.save()

        response_data = {
            'user_id': user.id,
            'final_total': final_total,
            'result': result_message
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class NewsList(APIView):
    def get(self, request):
        news = News.objects.all()
        serializer = NewsSerializer(news, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MasterClassList(APIView):
    def get(self, request):
        master_classes = MasterClass.objects.all()
        serializer = MasterClassSerializer(master_classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MasterClassSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
