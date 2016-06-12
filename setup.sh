ls /tmp/ceyescloud

if [[ $? -ne 0 ]]
then
echo "mkdir ceyescloud"
mkdir -p /tmp/ceyescloud
fi

ls public/img/ceyescloud

if [[ $? -ne 0 ]]
then
echo " chmod  +x qr"
chmod +x qr
ln -s /tmp/ceyescloud ./public/img
fi

chmod +x 123.sh
chmod +x 125.sh

