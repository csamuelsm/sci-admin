import { Button, Flex, Link, Text } from '@chakra-ui/react';
import { useSession, signOut } from "next-auth/react";
import { IoIosLogOut } from "react-icons/io";

const Footer = () => {
  const { data: session, status } = useSession()
  return (
    <Flex as="footer" width="full" justifyContent="center" flexDirection='column' textAlign='center'>
      <Text fontSize="sm">
        {new Date().getFullYear()} -{' '}

          Secretaria de Cooperação Internacional - UFCA

      </Text>
      {status === "authenticated" &&
        <Button alignSelf='center' variant='outline' colorScheme='red' rightIcon={<IoIosLogOut />} onClick={() => signOut({ callbackUrl: '/' })}>
          Sair
        </Button>
      }
    </Flex>
  );
};

export default Footer;
