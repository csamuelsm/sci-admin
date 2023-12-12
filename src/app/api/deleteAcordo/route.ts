import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type DeleteAcordoType = {
    id:number,
}

async function deleteAcordo({ id } : DeleteAcordoType) {
  let deleted = await prisma.acordo.delete({
    where: {
        id: id,
    }
  });
  return deleted;
}

export const POST = async (request:NextRequest) => {
    let params = await request.json();

    try {
        let id = parseInt(params['id'])
        
        const deleted = await deleteAcordo({ id });
        //console.log(user, pass);
        if (deleted) {
            //console.log(user);
            return NextResponse.json(deleted, { status: 200 });
        } else {
            return NextResponse.json({ err: 'Não foi possível deletar o acordo.' }, { status: 403 });
        }

    } catch {
        return NextResponse.json({ err: 'O sistema se comportou de maneira inesperada' }, { status: 500 });
    }
    //return NextResponse.json(params);
}