from django.shortcuts import render,redirect
from .models import *
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

def home(request):
    # Add debug print
    print("Home view called")
    try:
        return render(request, 'index.html')
    except Exception as e:
        print(f"Error rendering home page: {e}")
        return HttpResponse("Error loading home page")

def login(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')
        print(f"Login attempt for email: {email}")  # Debug print

        customer = Customer.objects.filter(email=email)

        if not customer.exists():
            print("Email not registered")  # Debug print
            return redirect('/signup')
        else:
            customer = Customer.objects.get(email=email)
            password_correct = check_password(password, customer.password)
            print(f"Password correct: {password_correct}")  # Debug print
            if password_correct:
                redirect_url = f'/main/{customer.id}'
                print(f"Redirecting to: {redirect_url}")  # Debug print
                return redirect(redirect_url)
            else:
                print('Password is incorrect')  # Debug print
                return redirect('/login')

    return render(request, 'login.html')

def signup(request):
    if request.method == "POST":
       name=request.POST.get('name')
       email=request.POST.get('email')
       phone_number=request.POST.get('phone')
       address=request.POST.get('address')
       password=request.POST.get('password')
       confirm_password=request.POST.get('confirm-password')

       if password==confirm_password:
           password=make_password(password)
           ins=Customer(name=name,email=email,phone_number=phone_number,password=password,address=address)
           ins.save()
           return redirect(f'/main/{ins.id}')
       else:
           print('confirm password AND PASWORD NOT EQUAL')

    return render(request,'login.html')

def main(request,cid):
    customer=Customer.objects.get(id=cid)
    context={'customer':customer}
    return render(request,'main.html',context)

def borewellRegister(request):
    if request.method == "POST":
        cid=request.POST.get('cid')
        latitude=request.POST.get('latitude')
        longitude=request.POST.get('longitude')
        well_type=request.POST.get('well-type')
        dug_well=request.POST.get('dug-well')
        wall_type=request.POST.get('wall-type')
        drilled_well=request.POST.get('drilled-well')
        supply_system=request.POST.get('supply-system')
        exact_depth=request.POST.get('exact-depth')
        motor_operated=request.POST.get('motor-operated')
        authorities_aware=request.POST.get('authorities-aware')
        description=request.POST.get('description')

        customer=Customer.objects.get(id=cid)
        m=False
        a=False
        if motor_operated == 'on':
            m=True

        if authorities_aware == 'on':
            a=True

        if wall_type is None:
            wall_type=""

        if supply_system  is None:
            supply_system=""

        if exact_depth == '':
            exact_depth=0

        if well_type == "dug-well":
            ins=Borewell(customer=customer,latitude=latitude,longitude=longitude,well_type=well_type,depth_type=dug_well,wall_type=wall_type,supply_system="",exact_depth=exact_depth,motor_operated=m,authorities_aware=a,description=description)
        elif well_type == "drilled-well":
            ins=Borewell(customer=customer,latitude=latitude,longitude=longitude,well_type=well_type,depth_type=drilled_well,wall_type="",supply_system=supply_system,exact_depth=exact_depth,motor_operated=m,authorities_aware=a,description=description)
        else:
            ins=Borewell(customer=customer,latitude=latitude,longitude=longitude,well_type=well_type,depth_type="",wall_type="",supply_system="",exact_depth=exact_depth,motor_operated=m,authorities_aware=a,description=description)
        
        ins.save()
        
    return JsonResponse({
            'borewell': {
                'latitude': ins.latitude,
                'longitude': ins.longitude,
                'name':customer.name,
                'phone_number':str(customer.phone_number)
            }
        })

def get_borewells(request):
    borewells=Borewell.objects.all()

    borewell_data = []
    for borewell in borewells:
        borewell_data.append({
            'latitude': borewell.latitude,
            'longitude': borewell.longitude,
            'customer_name': borewell.customer.name,
            'customer_phone_number': str(borewell.customer.phone_number)  # Convert PhoneNumber to string
        })
    
    # Return the data as a JSON response
    return JsonResponse({'borewells': borewell_data})

@csrf_exempt
def get_borewell_owners(request):
    if request.method == "GET":
        borewells = Borewell.objects.all().values(
            'latitude', 'longitude', 'customer__name', 'customer__phone_number','customer__address', 'customer__email'
        )
        # Construct the response with distance information if needed
        response_data = [
            {
                'name': borewell['customer__name'],
                'address': borewell['customer__address'],
                'phone':str(borewell['customer__phone_number']),
                'email':borewell['customer__email'],
                'latitude': borewell['latitude'],
                'longitude': borewell['longitude'],
                
            }
            for borewell in borewells
        ]
        return JsonResponse(response_data, safe=False)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

def logout(request):
    # Clear all session data
    request.session.flush()
    return redirect('/login')
    
