-- CreateTable
CREATE TABLE "doctors" (
    "name" VARCHAR(150),
    "surname" VARCHAR(150),
    "telephone" VARCHAR(80),
    "email" VARCHAR(100),
    "id" SERIAL NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "name" VARCHAR(100),
    "surname" VARCHAR(100),
    "telephone" VARCHAR(80),
    "email" VARCHAR(100),
    "id" SERIAL NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "surname" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

