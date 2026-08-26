#!/bin/bash

set -e

CONTAINER_NAME="speakprep-ai"
IMAGE_NAME="speakprep-ai:latest"
PORT="8000"

echo "🚀 Starting SpeakPrepAI AI Service..."

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "🧹 Removing existing container..."
    docker rm -f "$CONTAINER_NAME"
fi

echo "🐳 Starting AI container..."

docker run \
    --name "$CONTAINER_NAME" \
    -p "$PORT:8000" \
    --env-file .env.docker \
    "$IMAGE_NAME"