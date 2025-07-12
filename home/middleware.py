from django.shortcuts import redirect
from django.urls import reverse

class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # URLs that don't require authentication
        public_urls = ['/login/', '/signup/', '/', '/home/']
        
        # Check if the user is authenticated for protected routes
        if request.path.startswith('/main/') and not request.session.get('user_id'):
            return redirect('login')
            
        response = self.get_response(request)
        return response 