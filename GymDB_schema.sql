CREATE TABLE "member" (
	"id" INTEGER NOT NULL UNIQUE,
	"name" VARCHAR,
	"phone" BIGINT UNIQUE,
	"age" SMALLINT,
	"Weight" SMALLINT,
	"height" SMALLINT,
	"address" TEXT,
	PRIMARY KEY("id")
);


CREATE TABLE "plans" (
	"id" INTEGER NOT NULL UNIQUE,
	"name" VARCHAR UNIQUE,
	"period" INTEGER,
	"cost" MONEY,
	PRIMARY KEY("id")
);


CREATE TABLE "discount" (
	"id" INTEGER NOT NULL UNIQUE,
	"Code" VARCHAR UNIQUE,
	"value" SMALLINT,
	"is_percentage" BOOLEAN DEFAULT False,
	PRIMARY KEY("id")
);


CREATE TABLE "Cashier" (
	"id" INTEGER NOT NULL UNIQUE,
	"name" VARCHAR,
	"phone" BIGINT UNIQUE,
	"Nat_id" VARCHAR UNIQUE,
	"address" TEXT,
	PRIMARY KEY("id")
);


CREATE TABLE "coach" (
	"id" INTEGER NOT NULL UNIQUE,
	"name" VARCHAR,
	"phone" INTEGER UNIQUE,
	"Nat_id" VARCHAR UNIQUE,
	"address" TEXT,
	PRIMARY KEY("id")
);


CREATE TABLE "invoice" (
	"id" INTEGER NOT NULL UNIQUE,
	"member" INTEGER,
	"plane" INTEGER,
	"have_taxs" BOOLEAN DEFAULT False,
	"Time" TIME,
	"have_discount" BOOLEAN DEFAULT False,
	"have_private_coach" BOOLEAN DEFAULT False,
	"Date" DATE,
	"cashier" INTEGER,
	"amount" MONEY,
	"coach" INTEGER,
	"Discount " INTEGER,
	"has_refunded" BOOLEAN DEFAULT False,
	PRIMARY KEY("id")
);


CREATE TABLE "Subscription" (
	"id" INTEGER NOT NULL UNIQUE,
	"member" INTEGER,
	"start_date" DATE,
	"End_date" DATE,
	"was_refunded" BOOLEAN DEFAULT False,
	"invoice" INTEGER,
	PRIMARY KEY("id")
);


ALTER TABLE "coach"
ADD FOREIGN KEY("id") REFERENCES "invoice"("coach")
ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "invoice"
ADD FOREIGN KEY("member") REFERENCES "member"("id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "Cashier"
ADD FOREIGN KEY("id") REFERENCES "invoice"("cashier")
ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "plans"
ADD FOREIGN KEY("id") REFERENCES "invoice"("plane")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "discount"
ADD FOREIGN KEY("id") REFERENCES "invoice"("Discount ")
ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "member"
ADD FOREIGN KEY("id") REFERENCES "Subscription"("member")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Subscription"
ADD FOREIGN KEY("invoice") REFERENCES "invoice"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;