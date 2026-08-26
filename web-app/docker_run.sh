#!/bin/bash

set -e

CONTAINER_NAME="speakprep-web"
IMAGE_NAME="speakprep-web:latest"
PORT="3000"

echo "🚀 Starting SpeakPrepAI Web Container..."

# Remove existing container if it exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "🧹 Removing existing container..."
    docker rm -f "$CONTAINER_NAME"
fi

echo "🐳 Starting Docker container..."

docker run \
    --name "$CONTAINER_NAME" \
    -p "$PORT:3000" \
    --env-file .env.docker \
    "$IMAGE_NAME"

echo "✅ SpeakPrepAI Web is running on http://localhost:$PORT"