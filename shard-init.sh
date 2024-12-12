#!/bin/bash
#docker-compose up -d
# Переменные конфигурации
CONFIG_SERVER="configsvr:27019"
SHARD1="shard1:27018"
SHARD2="shard2:27018"
SHARD3="shard3:27018"
REPL_SET_CONFIG="configReplSet"
REPL_SET_SHARD1="shard1ReplSet"
REPL_SET_SHARD2="shard2ReplSet"
REPL_SET_SHARD3="shard3ReplSet"

# Инициализация репликации для Config Server
echo "Инициализация репликации для Config Server..."
docker exec -it configsvr mongosh --port 27019 --eval "
rs.initiate({
  _id: \"$REPL_SET_CONFIG\",
  configsvr: true,
  members: [{ _id: 0, host: \"$CONFIG_SERVER\" }]
});"

# Инициализация репликации для Shard 1
echo "Инициализация репликации для Shard 1..."
docker exec -it shard1 mongosh --port 27018 --eval "
rs.initiate({
  _id: \"$REPL_SET_SHARD1\",
  members: [{ _id: 0, host: \"$SHARD1\" }]
});"

# Инициализация репликации для Shard 2
echo "Инициализация репликации для Shard 2..."
docker exec -it shard2 mongosh --port 27018 --eval "
rs.initiate({
  _id: \"$REPL_SET_SHARD2\",
  members: [{ _id: 0, host: \"$SHARD2\" }]
});"

# Инициализация репликации для Shard 3
echo "Инициализация репликации для Shard 3..."
docker exec -it shard3 mongosh --port 27018 --eval "
rs.initiate({
  _id: \"$REPL_SET_SHARD3\",
  members: [{ _id: 0, host: \"$SHARD3\" }]
});"

# Добавление шардов в Mongos
echo "Добавление шардов в Mongos..."
docker exec -it mongos mongosh --port 27017 --eval "
sh.addShard(\"$REPL_SET_SHARD1/$SHARD1\");
sh.addShard(\"$REPL_SET_SHARD2/$SHARD2\");
sh.addShard(\"$REPL_SET_SHARD3/$SHARD3\");
"

# Проверка состояния шардирования
echo "Проверка состояния шардирования..."
docker exec -it mongos mongosh --eval 'sh.status();'

echo "Шардирование настроено!"
