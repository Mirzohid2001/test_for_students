from django.urls import path
from .views import AcademyList, AcademyDetail, TeacherList, TeacherDetail, GroupList, GroupDetailView, UserList, \
    UserDetail, CheckpointListView, QuestionsList, ExaminationList, ExaminationDetail, ResultList, StartExamination, \
    RetakeExam, GroupAverage, TeacherDetailView, AcademyDetailView, GroupExamsStatus, FinalExamGroupUsersView, \
    FinalExamStartAPIView, \
    FinalExamRetakeListView, FinalExamSubmit, FinalExamCheckpointList, FinalExamQuestionList, RetakeFinalExamAPIView, \
    FinalExamGroupDetailView, NewsList, MasterClassList, SubmitConcursAnswer, ConcursResultsAPIView, \
    ConcursWinnerAPIView, ConcursGroupList, ConcursUserList, ConcursCheckpointQuestionsAPIView, ConcursCheckpointList

urlpatterns = [
    path('academies/', AcademyList.as_view(), name='academy-list'),
    path('academies/<int:pk>/', AcademyDetail.as_view(), name='academy-detail'),
    path('teachers/', TeacherList.as_view(), name='teacher-list'),
    path('teachers/<int:pk>/', TeacherDetail.as_view(), name='teacher-detail'),
    path('groups/', GroupList.as_view(), name='group-list'),
    path('groups/<int:group_id>/', GroupDetailView.as_view(), name='group-detail'),
    path('users/', UserList.as_view(), name='user-list'),
    path('user-detail/<int:user_id>/', UserDetail.as_view(), name='user-detail'),
    path('api/checkpoints/', CheckpointListView.as_view(), name='checkpoint-list'),
    path('questions/', QuestionsList.as_view(), name='questions-list'),
    path('examinations/', ExaminationList.as_view(), name='examination-list'),
    path('examinations/<int:pk>/', ExaminationDetail.as_view(), name='examination-detail'),
    path('results/', ResultList.as_view(), name='result-list'),
    path('start-exam/<int:user_id>/<int:group_id>/', StartExamination.as_view(), name='start-exam'),
    path('retakes/<int:group_id>/', RetakeExam.as_view(), name='retake-exam-list'),
    path('retake-exam/<int:user_id>/<int:group_id>/', RetakeExam.as_view(), name='retake-exam'),
    path('group-average/<int:group_id>/', GroupAverage.as_view(), name='group-average'),
    path('group-exams-status/<int:group_id>/', GroupExamsStatus.as_view(), name='group-exams-status'),
    path('teacher-detail/<int:teacher_id>/', TeacherDetailView.as_view(), name='teacher-detail'),
    path('academy-detail/<int:academy_id>/', AcademyDetailView.as_view(), name='academy-detail'),
    path('final-exam-checkpoints/', FinalExamCheckpointList.as_view(), name='final-exam-checkpoints'),
    path('final-exam-questions/<int:checkpoint_id>/', FinalExamQuestionList.as_view(), name='final-exam-questions'),
    path('finalexam-groups/<int:group_id>/', FinalExamGroupDetailView.as_view(), name='finalexam-group-detail'),
    path('final-exam-group-users/<int:group_id>/', FinalExamGroupUsersView.as_view(), name='final-exam-group-users'),
    path('final-exam-start/<int:user_id>/<int:group_id>/', FinalExamStartAPIView.as_view(), name='final-exam-start'),
    path('final-exam-submit/<int:user_id>/<int:group_id>/', FinalExamSubmit.as_view(), name='final-exam-submit'),
    path('final-exam-retake/<int:user_id>/<int:group_id>/', RetakeFinalExamAPIView.as_view(), name='final-exam-retake'),
    path('final-exam-retake-list/', FinalExamRetakeListView.as_view(), name='final-exam-retake-list'),
    path('news/', NewsList.as_view(), name='news-list'),
    path('masterclass/', MasterClassList.as_view(), name='masterclass-list'),
    path('concurs/submit-answer/<int:user_id>/<int:question_id>/', SubmitConcursAnswer.as_view(),
         name='submit-concurs-answer'),
    path('concurs/checkpoints/', ConcursCheckpointList.as_view(), name='concurs-checkpoints'),
    path('concurs/checkpoints/<int:checkpoint_id>/questions/', ConcursCheckpointQuestionsAPIView.as_view(),
         name='concurs-checkpoint-questions'),
    path('concurs/results/<int:checkpoint_id>/', ConcursResultsAPIView.as_view(), name='concurs-results'),
    path('concurs/winner/<int:checkpoint_id>/', ConcursWinnerAPIView.as_view(), name='concurs-winner'),
    path('concurs/groups/', ConcursGroupList.as_view(), name='concurs-groups'),
    path('concurs/groups/<int:group_id>/users/', ConcursUserList.as_view(), name='concurs-user-list'),
]
