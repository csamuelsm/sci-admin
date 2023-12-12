'use client';

import { Box, Divider, Flex, Heading, Input, VStack, InputRightAddon, InputGroup, Text, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoIosLogIn } from "react-icons/io";
import PasswordInput from '~/lib/components/PasswordInput';
import { signIn, useSession } from "next-auth/react";

var Hashes = require('jshashes');

const Home = () => {

  const [user, setUser] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const toast = useToast()
  const { push } = useRouter();
  const { data: session, status } = useSession()

  async function findUser(user: string, pass: string) {
    let hash = new Hashes.SHA1().hex(pass);
    let res = await fetch('/api/checkUser', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `${user}@ufca.edu.br`,
        pass: hash
      })
    });
    if (res.status != 200) {
      toast({
        title: 'Login ou senha errados.',
        description: "Corrija seus dados e tente novamente",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    } else {
      //let json = await res.json();
      toast({
        title: 'Login bem sucedido',
        description: "Estamos redirecionando você para o sistema",
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
      //push('/main');
      signIn("credentials", {
        redirect: true,
        email: `${user}@ufca.edu.br`,
        password: hash,
        callbackUrl: '/main'
      })
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      toast({
        title: 'Você já está logado',
        description: "Estamos redirecionando você para o sistema",
        status: 'success',
        duration: 6000,
        isClosable: true,
      });
      push('/main');
    }
  }, [status]);

  return (

    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
      textAlign='center'
    >
      <Heading as='h1'>
        Gerenciador de Acordos Internacionais
      </Heading>
      <Heading as='h2' size='sm'>
        Secretaria de Cooperação Internacional - UFCA
      </Heading>
      <Divider />
      <Text>
        Faça log-in para continuar:
      </Text>
      <VStack gap={6}>
        <Box w='100%'>
          <InputGroup w='100%'>
            <Input placeholder='E-mail' value={user} onChange={(e) => setUser(e.target.value)} />
            <InputRightAddon children='@ufca.edu.br' />
          </InputGroup>
        </Box>
        <Box w='100%'>
          <PasswordInput pass={pass} setPass={setPass} />
        </Box>
        <Box>
          <Button size='lg' colorScheme='blue' rightIcon={<IoIosLogIn />} isDisabled={!(user.length > 0 && pass.length > 0)} onClick={() => findUser(user, pass)}>
            Entrar
          </Button>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Home;
