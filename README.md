# Payments
Node Payment Service
# Dependencias
$ node -v

$\ge$ v14.13.1

$ docker -v

$\ge$ Docker version 18.09.7

$ npm -v


# Levantar el servicio con Docker
En la raíz del proyecto y con los permisos Docker necesarios correr:

- `docker build -t ms-payments:0.0.1` genera la imagen docker
- `docker run -d -p 3010:3010 -name ms-payments ms-payments:0.0.1` levanta la imagen anteriormente generada
# Levantar un postgresSQL local con Docker
```
docker run --name basic-postgres --rm -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e PGDATA=/var/lib/postgresql/data/pgdata -v /tmp:/var/lib/postgresql/data -p 5432:5432 -it postgres:14.1-alpine
```
# Uso del API
Hacer GET simple que retorna sin más
```
curl -X GET http://localhost:3010/
```
### Obtener Transaccion por id
```
curl -X GET \
  http://localhost:3010/transactions/{id_transaccion} \
  -H 'content-type: application/json' \
```
<b>Reference</b>

<i>id_transaccion:</i> identificador de la transacción
