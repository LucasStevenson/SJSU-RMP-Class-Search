FROM python:3.11-slim

WORKDIR /sjsu-rmp-class-search

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["python3", "app.py", "--host", "0.0.0.0", "--port", "5000"]
