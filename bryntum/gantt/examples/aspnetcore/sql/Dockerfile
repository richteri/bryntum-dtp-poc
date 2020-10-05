FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=bryntum
ENV MYSQL_DATABASE=bryntum_gantt
ENV MYSQL_USER=bryntum
ENV MYSQL_PASSWORD=bryntum

COPY setup.sql /docker-entrypoint-initdb.d/
