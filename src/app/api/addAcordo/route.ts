import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type AcordoType = {
    instituicao:number,
    dataInicio:Date,
    dataFinal:Date,
    processo:string,
    responsavel:string
}

async function addInstituicao({ instituicao, dataInicio, dataFinal, processo, responsavel } : AcordoType) {
  let created = await prisma.acordo.create({
    data: {
        instituicao: {
            connect: {
                id: instituicao
            }
        },
        dataInicio: dataInicio,
        dataFinal: dataFinal,
        processo: processo,
        responsavel: responsavel
    }
  });
  return created;
}

export const POST = async (request:NextRequest) => {
    let params = await request.json();

    try {
        let instituicao = parseInt(params['instituicao']);
        let dataInicio = new Date(params['dataInicio']);
        let dataFinal = new Date(params['dataFinal']);
        let processo = params['processo'];
        let responsavel = params['responsavel'];
        
        const created = await addInstituicao({ instituicao, dataInicio, dataFinal, processo, responsavel });
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