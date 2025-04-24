FROM python:3.11-slim

# Install Tk and other dependencies
RUN apt-get update && apt-get install -y \
    python3-tk \
    tk-dev \
    libx11-dev \
    xvfb \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Set up Xvfb virtual display for headless rendering
ENV DISPLAY=:99

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directory for saved files
RUN mkdir -p /app/student_files

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start Xvfb and then run the application
CMD Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset & sleep 1 && python app.py
