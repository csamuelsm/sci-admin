import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type UpdateAcordoType = {
    id:number,
    dataFinal:Date,
    processo:string,
    responsavel:string
}

async function updateAcordo({ id, dataFinal, processo, responsavel } : UpdateAcordoType) {
  let updated = await prisma.acordo.update({
    where: {
        id: id,
    },
    data: {
        dataFinal: dataFinal,
        processo: processo,
        responsavel: responsavel
    }
  })
  return updated;
}

export const POST = async (request:NextRequest) => {
    let params = await request.json();

    try {
        let id = parseInt(params['id'])
        let dataFinal = new Date(params['dataFinal']);
        let processo = params['processo'];
        let responsavel = params['responsavel'];
        
        const updated = await updateAcordo({ id, dataFinal, processo, responsavel });
        //console.log(user, pass);
        if (updated) {
            //console.log(user);
            return NextResponse.json(updated, { status: 200 });
        } else {
            return NextResponse.json({ err: 'Não foi possível atualizar.' }, { status: 403 });
        }

    } catch {
        return NextResponse.json({ err: 'O sistema se comportou de maneira inesperada' }, { status: 500 });
    }
    //return NextResponse.json(params);
}