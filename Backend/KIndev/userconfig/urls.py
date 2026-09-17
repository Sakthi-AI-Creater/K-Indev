from django.urls import path
from . import views
from .views import LoginView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path('users/me/', views.CurrentUserView.as_view()),
    path('users/', views.ListUsersView.as_view()),
    path('users/delete/<int:user_id>/', views.delete_user, name='delete-user'),
    path('users/create/', views.CreateUserView.as_view()),
    path('users/update/<int:user_id>/', views.UpdateUserView.as_view(), name='update-user'),
    path('users/remove_image/<int:user_id>/', views.remove_profile_image),
]