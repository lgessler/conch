export HTTP_FORWARDED_COUNT=1
export CLUSTER_WORKERS_COUNT=auto
meteor --settings settings-dev.json | tee meteor.log
