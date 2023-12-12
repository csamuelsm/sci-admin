-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instituicao" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(300) NOT NULL,
    "sigla" VARCHAR(15) NOT NULL,
    "pais" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "telefone" VARCHAR(18),

    CONSTRAINT "Instituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acordo" (
    "id" SERIAL NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFinal" TIMESTAMP(3) NOT NULL,
    "processo" VARCHAR(255) NOT NULL,
    "responsavel" VARCHAR(100),

    CONSTRAINT "Acordo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Instituicao_nome_key" ON "Instituicao"("nome");

-- AddForeignKey
ALTER TABLE "Acordo" ADD CONSTRAINT "Acordo_id_fkey" FOREIGN KEY ("id") REFERENCES "Instituicao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
