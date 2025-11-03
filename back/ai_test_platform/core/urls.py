from django.urls import path
from .views import (
    ai_test,
    delete_test,
    save_test_result,
    get_test_result,
    reset_test_result,
)
from .get_tests import get_tests

urlpatterns = [
    path('generate-test/', ai_test),
    path('get-tests/', get_tests, name='get-tests'),
    path('delete-test/<int:test_id>/', delete_test, name='delete-test'),
    path('save-test-result/<int:test_id>/', save_test_result, name='save-test-result'),
    path('get-test-result/<int:test_id>/', get_test_result, name='get-test-result'),
    path('reset-test-result/<int:test_id>/', reset_test_result, name='reset-test-result'),
]
