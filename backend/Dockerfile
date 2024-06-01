FROM python:3.11

WORKDIR /code

COPY ./requirements.txt /code/requirements.xt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY /  /code/

CMD [ "uvicorn","main.py","--host","0.0.0.0","--port","8081" ]

