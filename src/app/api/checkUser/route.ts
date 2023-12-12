import { NextResponse } from 'next/server';
import { NextRequest } from "next/server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function checkUser() {
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

/*export const GET = async () => {
    await checkUser();
    return NextResponse.json({ name: 'John Doe' }, { status: 200 });
};*/

export const POST = async (request:NextRequest) => {
    //console.log('POST')
    let params = await request.json();
    try {
        let email = params['email'];
        let pass = params['pass'];
        const user = await prisma.user.findUnique({
            where: { email: email }
        })
        //console.log(user, pass);
        if (user !== null && user['password'] == pass) {
            //console.log(user);
            return NextResponse.json(user, { status: 200 });
        } else {
            return NextResponse.json({ err: 'Usuário não encontrado' }, { status: 403 });
        }
    } catch {
        return NextResponse.json({ err: 'Algo deu errado' }, { status: 500 });
    }
    //return NextResponse.json(params);
}