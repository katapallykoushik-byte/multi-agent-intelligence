FROM python:3.11-slim

WORKDIR /app

# Install build dependencies if needed and clean apt cache
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application backend and dataset
COPY backend ./backend
COPY Multi_Agent_Enterprise_Decision_Support_Dataset.csv .

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "python -m uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
