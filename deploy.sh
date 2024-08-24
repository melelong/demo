echo "开始部署..."

echo "创建网络中..."
if docker network ls -f "name=app_network" -q | grep -q .; then
    echo "app_network 网络已存在"
else
    docker network create --driver bridge --subnet 192.168.3.0/24 app_network
    echo "app_network 网络创建成功"
fi

echo "----启动前的容器服务----"
docker ps -a

echo "停止并删除当前路径下的容器服务中..."
docker-compose stop
docker-compose down --remove-orphans

echo "----pull前的镜像----"
docker images -a

if docker images | grep -q "${DOCKER_IMAGE_URL}/${DOCKER_IMAGE_URL_NAME}/${IMAGE_NAME}:${IMAGE_TAG}"; then
    echo "删除旧镜像中..."
    docker rmi ${DOCKER_IMAGE_URL}/${DOCKER_IMAGE_URL_NAME}/${IMAGE_NAME}:${IMAGE_TAG}
else
    echo "没有旧镜像"
fi

if docker images -f "dangling=true" -q | grep -q .; then
    echo "删除悬虚镜像中..."
    docker images -f "dangling=true" -q | xargs docker rmi
else
    echo "没有悬虚镜像"
fi

echo "拉取新镜像中..."
docker login -u "${DOCKER_LOGIN_USERNAME}" -p "${DOCKER_LOGIN_PASSWORD}" "${DOCKER_IMAGE_URL}";
docker pull ${DOCKER_IMAGE_URL}/${DOCKER_IMAGE_URL_NAME}/${IMAGE_NAME}:${IMAGE_TAG};
docker logout;
echo "拉取镜像完成"

echo "----pull后的镜像----"
docker images -a

echo "启动新的容器服务中..."
sudo docker-compose up -d

echo "----启动后的容器服务----"
docker ps -a
echo "部署成功"