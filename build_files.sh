echo "BUILD START"

python3.9 -m venv venv
source venv/bin/activate

# /vercel/path0/venv/bin/python3.9 -m pip install --upgrade pip

pip install -r requirements.txt
python3.9 manage.py collectstatic --noinput

echo "BUILD END"


# python manage.py runserver