# inventory-manager
 Selfhosted stock managing app

Install & run app :
```bash
apt update
apt upgrade -y
apt install curl unzip -y
curl -L -o app.zip https://github.com/St4lV/inventory-manager/archive/refs/heads/main.zip
unzip app.zip -d /var/
rm app.zip
cd /var/inventory-manager-main
chmod +x inventory-manager.sh
./inventory-manager.sh install
```
