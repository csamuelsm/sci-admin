import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function getAcordos() {
  const allAcordos = await prisma.acordo.findMany({
    select: {
      instituicao: {
        select: {
          nome: true
        }
      },
      id: true,
      dataInicio: true,
      dataFinal: true,
      processo: true,
      responsavel: true
    }
  });
  return allAcordos;
}

export const GET = async () => {
    let all = await getAcordos();
    return NextResponse.json(all, { status: 200 });
};