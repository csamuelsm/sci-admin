import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function getInstituicoes() {
  const allInstituicoes = await prisma.instituicao.findMany();
  return allInstituicoes;
}

export const GET = async () => {
    let all = await getInstituicoes();
    return NextResponse.json(all, { status: 200 });
};