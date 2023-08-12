FROM python:3.10
WORKDIR /app
COPY ./requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY . .
CMD ["/bin/bash", "-c", "gunicorn --bind 0.0.0.0:80 run:app && flask db upgrade"]