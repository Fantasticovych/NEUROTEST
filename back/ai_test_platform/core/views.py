from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Test, Question, TestResult
from openai import OpenAI
from decouple import config
import json

client = OpenAI(api_key=config("OPENAI_API_KEY"))

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ai_test(request):
    user = request.user
    topic = request.data.get("topic")
    subtopics = request.data.get("point")
    count = int(request.data.get("count", 1))
    difficulty = request.data.get("difficulty", "medium")

    subtopics_text = f"\nFocus specifically on these subtopics: {subtopics}.\n" if subtopics else ""

    prompt = (
        f"Generate {count} multiple-choice quiz questions about \"{topic}\" "
        f"with a difficulty level of \"{difficulty}\".{subtopics_text}\n\n"
        "Return the output strictly in the following JSON format:\n\n"
        "{\n"
        "  \"results\": [\n"
        "    {\n"
        "      \"question\": \"string\",\n"
        "      \"correct_answer\": \"string\",\n"
        "      \"incorrect_answers\": [\"string\", \"string\", \"string\"]\n"
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Do not include explanations. Do not wrap the JSON in markdown. Return only raw JSON. The result in Ukrainian."
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        result_json = json.loads(completion.choices[0].message.content)
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON from AI"}, status=500)

    test = Test.objects.create(user=user, topic=topic, difficulty=difficulty)

    for item in result_json.get("results", []):
        Question.objects.create(
            test=test,
            question=item["question"],
            correct_answer=item["correct_answer"],
            incorrect_answers=item["incorrect_answers"]
        )

    return Response({"message": "Test generated successfully"})

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_test(request, test_id):
    try:
        test = Test.objects.get(id=test_id, user=request.user)
        test.delete()
        return Response({"message": "Тест успішно видалено"}, status=200)
    except Test.DoesNotExist:
        return Response({"error": "Тест не знайдено або у вас немає прав на його видалення"}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_test_result(request, test_id):
    try:
        test = Test.objects.get(id=test_id, user=request.user)
        score = request.data.get("score")
        total_questions = request.data.get("total_questions")
        answers = request.data.get("answers", {})

        result = TestResult.objects.create(
            test=test,
            user=request.user,
            score=score,
            total_questions=total_questions,
            answers=answers
        )

        # 🔹 Оновлюємо дані тесту
        test.is_completed = True
        test.correct_answers_count = score
        test.total_questions = total_questions
        test.percentage_score = result.percentage
        test.save(update_fields=["is_completed", "correct_answers_count", "total_questions", "percentage_score"])

        return Response({
            "message": "Результат збережено успішно",
            "result_id": result.id,
            "score": result.score,
            "total": result.total_questions,
            "percentage": result.percentage
        }, status=201)

    except Test.DoesNotExist:
        return Response({"error": "Тест не знайдено"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_test_result(request, test_id):
    try:
        test = Test.objects.get(id=test_id, user=request.user)
        result = TestResult.objects.filter(test=test, user=request.user).order_by("-completed_at").first()

        if not result:
            return Response({"error": "Результат не знайдено"}, status=404)

        questions_with_answers = []
        for index, question in enumerate(test.questions.all()):
            user_answer = result.answers.get(str(index))
            questions_with_answers.append({
                "question": question.question,
                "correct_answer": question.correct_answer,
                "incorrect_answers": question.incorrect_answers,
                "user_answer": user_answer,
                "is_correct": user_answer == question.correct_answer
            })

        return Response({
            "test_id": test.id,
            "topic": test.topic,
            "difficulty": test.difficulty,
            "score": result.score,
            "total": result.total_questions,
            "percentage": result.percentage,
            "completed_at": result.completed_at.isoformat(),
            "questions": questions_with_answers
        })
    except Test.DoesNotExist:
        return Response({"error": "Тест не знайдено"}, status=404)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def reset_test_result(request, test_id):
    try:
        test = Test.objects.get(id=test_id, user=request.user)
        TestResult.objects.filter(test=test, user=request.user).delete()

        test.is_completed = False
        test.correct_answers_count = 0
        test.total_questions = 0
        test.percentage_score = 0.0
        test.save(update_fields=["is_completed", "correct_answers_count", "total_questions", "percentage_score"])

        return Response({"message": "Результат тесту очищено. Можна проходити заново."}, status=200)
    except Test.DoesNotExist:
        return Response({"error": "Тест не знайдено"}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_test(request, test_id):
    user = request.user
    data = request.data

    try:
        test = Test.objects.get(id=test_id, user=user)
    except Test.DoesNotExist:
        return Response({"error": "Test not found"}, status=404)

    correct_count = data.get("correct_answers_count", 0)
    total_questions = data.get("total_questions", 0)
    percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0

    test.is_completed = True
    test.correct_answers_count = correct_count
    test.total_questions = total_questions
    test.percentage_score = percentage
    test.save()

    return Response({"message": "Test result saved successfully"})
