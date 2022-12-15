[![codecov](https://codecov.io/gh/Taller-2-Tyrions/fiuber-payments/branch/main/graph/badge.svg?token=pqpC5Y9JiG)](https://codecov.io/gh/Taller-2-Tyrions/fiuber-payments)

# Fiuber-Payments

Microservicio implementado en Nodejs. Tiene a cargo llevar a cabo los pagos de los pasajeros una vez que finalizan los viajes.
Cada usuario tiene una Wallet que le permite hacer transacciones usando Ether.

# Documentación
Documentación técnica: https://taller-2-tyrions.github.io/fiuber-documentation-tecnica/

## Uso del API

### Obtener todas las wallets
```
curl --location --request GET 'https://fiuber-payments-new.herokuapp.com/wallets'
```

### Obtener una wallet por ID
```
curl --location --request GET 'https://fiuber-payments-new.herokuapp.com/wallet/636d4770e2f3f9a48e936725'
```

### Se realiza un deposito(el pasajero paga)
```
curl --location --request POST 'https://fiuber-payments-new.herokuapp.com/deposit' \
--header 'Content-Type: application/json' \
--data-raw '{
    "senderId": "1",
    "receiverId": "38CUrMJ6OeeaidRQKyA62yBBA7F3",
    "amountInEthers": "0.0003"
}'
```

### Creación de una Wallet
```
curl --location --request POST 'https://fiuber-payments-new.herokuapp.com/wallet' \
--header 'Content-Type: application/json' \
--data-raw '{
    "user_id": "cmyaQJfWuifQ4KFqBDyymgJRxOG2"
}'
```

### Retirar dinero por parte de un chofer
```
curl --location --request POST 'https://fiuber-payments-new.herokuapp.com/withdraw' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "3",
    "receiverAddress": "0x856edCbABB254Ed017f8c0B7Ed939c276E57ccCB",
    "amountInEthers": "0.0001"
}'
```

### Obtener el balance para un ID de usuario
```
curl --location --request GET 'https://fiuber-payments-new.herokuapp.com/balance/38CUrMJ6OeeaidRQKyA62yBBA7F3'
```

### Obtener el balance de todas las Wallets
```
curl --location --request GET 'https://fiuber-payments-new.herokuapp.com/payments'
```

### Obtener el balance para un usuario
```
curl --location --request GET 'https://fiuber-payments-new.herokuapp.com/payments/1'
```
