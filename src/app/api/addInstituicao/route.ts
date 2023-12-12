import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type InstituicaoType = {
    nome:string,
    sigla:string,
    pais:string,
    email:string|undefined,
    telefone:string|undefined
}

async function addInstituicao({ nome, sigla, pais, email, telefone } : InstituicaoType) {
  let created = await prisma.instituicao.create({
    data: {
        nome: nome,
        sigla: sigla,
        pais: pais,
        email: email,
        telefone: telefone
    }
  });
  return created;
}

export const POST = async (request:NextRequest) => {
    let params = await request.json();

    try {
        let nome = params['nome'];
        let sigla = params['sigla'];
        let pais = params['pais'];
        let email = params['email'];
        let telefone = params['telefone'];
        
        const created = await addInstituicao({ nome, sigla, pais, email, telefone });
        //console.log(user, pass);
        if (created) {
            //console.log(user);
            return NextResponse.json(created, { status: 200 });
        } else {
            return NextResponse.json({ err: 'Não foi possível criar o usuário' }, { status: 403 });
        }

    } catch {
        return NextResponse.json({ err: 'O sistema se comportou de maneira inesperada' }, { status: 500 });
    }
    //return NextResponse.json(params);
}