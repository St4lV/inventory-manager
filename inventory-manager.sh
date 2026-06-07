#!/bin/bash

case "$1" in
    update)
        echo "Updating..."
		mv .env .env.bak
        find . -type f ! -name "*.bak" -delete
        curl -L -o app.zip https://github.com/St4lV/inventory-manager/archive/refs/heads/main.zip
        rm api express_utils client
        unzip app.zip -d ../
        rm app.zip
        chmod +x inventory-manager.sh
        docker compose down
        docker container prune -f
        docker system prune -f
		mv .env.bak .env
        docker build -t inventory-manager . # --no-cache
        echo "Updated successfully"
        ./inventory-manager.sh start
        ;;

    start)
        echo "Starting..."
        docker compose up --detach
        ;;

    stop)
        echo "Stopping..."
        docker compose down
        ;;

    install)
        echo "Installing dependencies"
        apt update
        apt-get install ca-certificates
        install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
        chmod a+r /etc/apt/keyrings/docker.asc

        # Add the repository to Apt sources:
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
          $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
          tee /etc/apt/sources.list.d/docker.list > /dev/null
        apt-get update
        apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
        echo ""

        echo "Installing Online Media Converter App..."
        mkdir downloaded
        docker build -t inventory-manager . # --no-cache
        rm -rf node Dockerfile README.md .dockerignore .gitattributes .gitignore
        ./inventory-manager.sh start
        ;;

    *)
        echo "Usage: $0 {start|stop|install|update}"
        exit 1
        ;;
esac