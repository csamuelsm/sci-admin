// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function createFirstUser() {
  let user = await prisma.user.create({
    data: {
      name: 'Secretaria de Cooperação Internacional UFCA',
      email: 'sci@ufca.edu.br',
      password: '67f48b3704a1f11948e38d6c2d865142efc4478e'
    }
  });

  return user;
}

export const GET = async () => {
  try {
    let user = await createFirstUser();
    if (user) {
      return NextResponse.json({ name: 'John Doe' }, { status: 200 });
    } else {
      return NextResponse.json({ err: 'Algum erro desconhecido aconteceu. Não foi possível criar o usuário.' }, { status: 500 });
    }    
  } catch {
    return NextResponse.json({ err: 'Algum erro desconhecido aconteceu. Não foi possível criar o usuário.' }, { status: 500 });
  }
};
