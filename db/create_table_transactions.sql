*/ Create Transactions DataBase */
BEGIN;

CREATE TABLE IF NOT EXISTS transactions(
	id serial NOT NULL,
	user_id int NOT NULL,
	creation_date timestamp NOT NULL,
	amount int NOT NULL,
	primary key(id)
);

CREATE SEQUENCE transactions_id_seq
START 1
INCREMENT 1
MINVALUE 1
OWNED BY transactions.id;

COMMIT;
