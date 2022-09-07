# Payments
Node Payment Service
# Dependencias
$ node -v

$\ge$ v14.13.1

$ docker -v

$\ge$ Docker version 18.09.7

# Levantar el servicio con Docker
En la raíz del proyecto y con los permisos Docker necesarios correr:

- `docker build -t ms-payments:0.0.1` genera la imagen docker
- `docker run -d -p 3010:3010 -name ms-payments ms-payments:0.0.1` levanta la imagen anteriormente generada

# Uso del API
Hacer GET simple que retorna sin más

`curl -X GET http://localhost:3010/`
