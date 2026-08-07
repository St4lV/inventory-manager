#!/bin/bash

# ---- Configuration OSRM ----
OSRM_REGION="idf-elargie"
OSRM_DATA_DIR="./osrm-data"
OSRM_TMP_DIR="./osrm-data.tmp"
OSRM_PBF_URL="https://download.geofabrik.de/europe/france-latest.osm.pbf"
OSRM_BBOX="0.6,47.9,4.2,50.2"   # min_lon,min_lat,max_lon,max_lat (IDF + départements voisins)
OSRM_IMAGE="ghcr.io/project-osrm/osrm-backend:latest"
OSMIUM_IMAGE="osmium/osmium-tool"
OSRM_COMPOSE_SERVICE="osrm"

osrm_update() {
    echo "Updating OSRM ($OSRM_REGION)..."
    set -e

    rm -rf "$OSRM_TMP_DIR"
    mkdir -p "$OSRM_TMP_DIR"
    curl -L --fail -o "$OSRM_TMP_DIR/france-latest.osm.pbf" "$OSRM_PBF_URL"

    docker run --rm -v "$(pwd)/$OSRM_TMP_DIR:/data" "$OSMIUM_IMAGE" \
        osmium extract -b "$OSRM_BBOX" "/data/france-latest.osm.pbf" -o "/data/$OSRM_REGION.osm.pbf"
    rm -f "$OSRM_TMP_DIR/france-latest.osm.pbf"

    docker run --rm -v "$(pwd)/$OSRM_TMP_DIR:/data" "$OSRM_IMAGE" \
        osrm-extract -p /opt/car.lua "/data/$OSRM_REGION.osm.pbf"

    docker run --rm -v "$(pwd)/$OSRM_TMP_DIR:/data" "$OSRM_IMAGE" \
        osrm-partition "/data/$OSRM_REGION.osrm"

    docker run --rm -v "$(pwd)/$OSRM_TMP_DIR:/data" "$OSRM_IMAGE" \
        osrm-customize "/data/$OSRM_REGION.osrm"

    rm -f "$OSRM_TMP_DIR/$OSRM_REGION.osm.pbf"

    docker compose stop "$OSRM_COMPOSE_SERVICE" 2>/dev/null || true

    if [ -d "$OSRM_DATA_DIR" ]; then
        rm -rf "${OSRM_DATA_DIR}.old"
        mv "$OSRM_DATA_DIR" "${OSRM_DATA_DIR}.old"
    fi
    mv "$OSRM_TMP_DIR" "$OSRM_DATA_DIR"

    docker compose up --detach "$OSRM_COMPOSE_SERVICE"
    rm -rf "${OSRM_DATA_DIR}.old"

    set +e
    echo "Done."
}

case "$1" in
    update)
        echo "Updating..."
        mv .env .env.bak
        find . -type f ! -name "*.bak" ! -path "./$OSRM_DATA_DIR/*" -delete
        curl -L -o app.zip https://github.com/St4lV/inventory-manager/archive/refs/heads/main.zip
        rm -r api express_utils client
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

    update-osrm)
        osrm_update
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

        osrm_update

        ./inventory-manager.sh start
        ;;

    *)
        echo "Usage: $0 {start|stop|install|update|update-osrm}"
        exit 1
        ;;
esac