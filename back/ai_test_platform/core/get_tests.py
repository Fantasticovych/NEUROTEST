from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Test, TestResult

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tests(request):
    user = request.user
    tests = Test.objects.filter(user=user).prefetch_related("questions")

    data = []
    for test in tests:

        last_result = (
            TestResult.objects
            .filter(test=test, user=user)
            .order_by("-completed_at")
            .first()
        )

        is_completed = last_result is not None

        q_list = [
            {
                "id": q.id,
                "question": q.question,
                "correct_answer": q.correct_answer,
                "incorrect_answers": q.incorrect_answers,
            }
            for q in test.questions.all()
        ]

        data.append({
            "test_id": test.id,
            "topic": test.topic,
            "difficulty": test.difficulty,
            "is_completed": is_completed,
            "questions": q_list,
            "created_at": test.created_at,
            "last_result": {
                "id": last_result.id,
                "score": last_result.score,
                "total": last_result.total_questions,
                "percentage": last_result.percentage,
                "completed_at": last_result.completed_at,
                "answers": last_result.answers,
            } if last_result else None,
        })

    return Response(data)
