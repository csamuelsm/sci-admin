'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { notFound } from 'next/navigation';
import { 
    Button, 
    Flex, 
    Heading, 
    Link, 
    Text, 
    Spinner, 
    Grid, 
    GridItem, 
    TableContainer, 
    Table, 
    Thead, 
    Tr, 
    Th, 
    Divider, 
    Tbody, 
    Td,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Portal,
    VStack,
    FormControl,
    Input,
    FormLabel,
    FormErrorMessage,
    useToast
 } from '@chakra-ui/react';
import { Formik, Field } from "formik";
import { FaUniversity, FaPlus } from "react-icons/fa";
import InstituicaoModal from '~/lib/components/InstituicaoModal';
import AcordoModal from '~/lib/components/AcordoModal';

import { MdOutlineUpdate } from "react-icons/md";
import { MdOutlineDeleteForever } from "react-icons/md";

function Main() {
    const { data: session, status } = useSession()
    const [instituicaoModal, setInstituicaoModal] = useState<boolean>(false);
    const [acordoModal, setAcordoModal] = useState<boolean>(false);
    const [acordos, setAcordos] = useState<{
        instituicao: {
            nome: string
        },
        id: number,
        dataInicio: string,
        dataFinal: string,
        processo: string,
        responsavel: string|null
    }[]>([]);
    const toast = useToast();

    async function deleteAcordo(id:number) {
        let deleted = await fetch('/api/deleteAcordo', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
            })
        });

        if (deleted.status != 200) {
            toast({
                title: "Não foi possível deletar o acordo.",
                description: "Algum erro inesperado aconteceu e não conseguimos deletar este acordo. Tente novamente ou entre em contato com o desenvolvedor.",
                status: 'error',
                duration: 7000,
                isClosable: true
            });
        } else {
            toast({
                title: "Acordo deletado com sucesso.",
                description: "Atualize a página para que a tabela seja atualizada.",
                status: 'success',
                duration: 7000,
                isClosable: true
            })
        }
    }

    useEffect(() => {
        async function getAcordos() {
            let res = await fetch('/api/getAcordos');
            let data = await res.json();
            setAcordos(data);
        }

        getAcordos();
    }, []);

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
            {status === "loading" &&
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                        label='Carregando'
                    />
            }

            {status === "authenticated" &&
                    <>
                        <Flex w='100%' flexDirection='column' alignItems='center' textAlign='center' gap={6}>
                            <Heading size='md' as='h2'>
                                Acordos Internacionais
                            </Heading>
                            <Text marginY={3} fontSize='sm'>
                                Adicione instituições e acordos abaixo. Os acordos em <b><Text as='span' color='orange.500'>laranja</Text></b> estão há menos de 7 dias de se vencerem. Os acordos em <b><Text as='span' color='yellow.500'>amarelo</Text></b> estão há menos de 30 dias de se vencerem.
                                Os acordos com <span style={{
                                    textDecoration: 'line-through'
                                }}>traçado</span> já se venceram.
                            </Text>
                            <TableContainer>
                                <Table size='sm' variant='simple'>
                                    <Thead>
                                        <Tr>
                                            <Th>ID</Th>
                                            <Th>Instituicao</Th>
                                            <Th>Início</Th>
                                            <Th>Final</Th>
                                            <Th>Processo</Th>
                                            <Th>Responsável</Th>
                                            <Th>Ações</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {acordos.map((el, idx) => {
                                            let inicio = new Date(el.dataInicio);
                                            let hoje = new Date();
                                            let final = new Date(el.dataFinal);

                                            const diffTime = final.getTime() - hoje.getTime();
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            function getRowColor() {
                                                if (diffDays <= 7 && diffDays >= 0) {
                                                    return 'orange.500';
                                                } else if (diffDays <= 30 && diffDays >= 0) {
                                                    return 'yellow.500'
                                                } else {
                                                    return ;
                                                }
                                            }

                                            return (
                                                <Tr backgroundColor={getRowColor()} style={{
                                                    textDecoration: diffDays < 0 ? 'line-through' : 'none'
                                                }}>
                                                    <Td>{el.id}</Td>
                                                    <Td>{el.instituicao.nome}</Td>
                                                    <Td>{inicio.toLocaleDateString()}</Td>
                                                    <Td>{final.toLocaleDateString()}</Td>
                                                    <Td>{el.processo}</Td>
                                                    <Td>{el.responsavel}</Td>
                                                    <Td>
                                                        <Popover
                                                            placement='top'
                                                            closeOnBlur={false}
                                                        >
                                                            <PopoverTrigger>
                                                                <Button size='xs' marginX={1} colorScheme='cyan' leftIcon={<MdOutlineUpdate />}>
                                                                    Renovar
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <Portal>
                                                                <PopoverContent>
                                                                    <PopoverArrow />
                                                                    <PopoverHeader>
                                                                        <b>Atualizar Acordo #{el.id}</b>
                                                                    </PopoverHeader>
                                                                    <PopoverCloseButton />
                                                                    <PopoverBody>
                                                                        <Formik
                                                                            initialValues={{
                                                                                dataFinal: el.dataFinal,
                                                                                processo: el.processo,
                                                                                responsavel: el.responsavel,
                                                                            }}
                                                                            onSubmit={(values, actions) => {
                                                                                async function updateAcordo() {
                                                                                    let updated = await fetch('/api/updateAcordo', {
                                                                                        method: "POST",
                                                                                        headers: {
                                                                                            "Content-Type": "application/json",
                                                                                        },
                                                                                        body: JSON.stringify({
                                                                                            id: el.id,
                                                                                            dataFinal: values.dataFinal,
                                                                                            processo: values.processo,
                                                                                            responsavel: values.responsavel
                                                                                        })
                                                                                    });

                                                                                    if (updated.status != 200) {
                                                                                        toast({
                                                                                            title: "Algo deu errado.",
                                                                                            description: "Não foi possível atualizar este acordo. Tente novamente ou entre em contato com o desenvolvedor.",
                                                                                            status: 'error',
                                                                                            duration: 7000,
                                                                                            isClosable: true
                                                                                        });
                                                                                    } else {
                                                                                        toast({
                                                                                            title: "Acordo renovado com sucesso.",
                                                                                            description: "Atualize a página para visualizar os dados atualizados na tabela.",
                                                                                            status: 'success',
                                                                                            duration: 7000,
                                                                                            isClosable: true
                                                                                        });
                                                                                    }

                                                                                    actions.resetForm();
                                                                                    actions.setSubmitting(false);
                                                                                }

                                                                                updateAcordo();
                                                                            }}
                                                                        >
                                                                            {({ handleSubmit, errors, touched, isSubmitting }) => (
                                                                                <form onSubmit={handleSubmit}>
                                                                                    <VStack spacing={2} align='flex-start'>
                                                                                        <Text fontSize='xs'><b>Instituição: </b>{el.instituicao.nome}</Text>
                                                                                        <Text fontSize='xs'><b>Data inicial: </b>{inicio.toLocaleDateString()}</Text>
                                                                                        <FormControl isInvalid={touched.dataFinal && errors.dataFinal !== undefined}>
                                                                                            <FormLabel fontSize='xs' marginBottom={0}>Data do Final</FormLabel>
                                                                                            <Field
                                                                                                name='dataFinal'
                                                                                                as={Input}
                                                                                                type='datetime-local'
                                                                                                size='xs'
                                                                                                validate={(value:string) => {
                                                                                                    let error;
                                                                                                    let date = new Date(value);

                                                                                                    if (value == undefined || value.length == 0) {
                                                                                                        error = "Este campo é obrigatório."
                                                                                                    }

                                                                                                    if (date <= inicio) {
                                                                                                        error = "A data final não pode ser anterior à data inicial."
                                                                                                    }

                                                                                                    return error;
                                                                                                }}
                                                                                            />
                                                                                            <FormErrorMessage>{errors.dataFinal}</FormErrorMessage>
                                                                                        </FormControl>
                                                                                        <FormControl isInvalid={touched.processo && errors.processo !== undefined}>
                                                                                            <FormLabel fontSize='xs' marginBottom={0}>Processo</FormLabel>
                                                                                            <Field
                                                                                                name='processo'
                                                                                                as={Input}
                                                                                                type='text'
                                                                                                size='xs'
                                                                                                validate={(value:string) => {
                                                                                                    let error;

                                                                                                    if (value.length == 0) error = "Este campo é obrigatório.";

                                                                                                    return error;
                                                                                                }}
                                                                                            />
                                                                                            <FormErrorMessage>{errors.processo}</FormErrorMessage>
                                                                                        </FormControl>
                                                                                        <FormControl isInvalid={touched.responsavel && errors.responsavel !== undefined}>
                                                                                            <FormLabel fontSize='xs' marginBottom={0}>Responsável</FormLabel>
                                                                                            <Field
                                                                                                name='responsavel'
                                                                                                as={Input}
                                                                                                type='text'
                                                                                                size='xs'
                                                                                                validate={(value:string) => {
                                                                                                    let error;

                                                                                                    if (value.length == 0) error = "Este campo é obrigatório.";

                                                                                                    return error;
                                                                                                }}
                                                                                            />
                                                                                            <FormErrorMessage>{errors.responsavel}</FormErrorMessage>
                                                                                        </FormControl>
                                                                                        <Button type='submit' colorScheme='teal' width='full' size='xs' marginY={2} isLoading={isSubmitting}>
                                                                                            Atualizar
                                                                                        </Button>
                                                                                    </VStack>
                                                                                </form>
                                                                            )}
                                                                        </Formik>
                                                                    </PopoverBody>
                                                                </PopoverContent>
                                                            </Portal>
                                                        </Popover>

                                                        <Popover>
                                                            <PopoverTrigger>
                                                                <Button size='xs' marginX={1} colorScheme='red' leftIcon={<MdOutlineDeleteForever/>}>
                                                                    Deletar
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <Portal>
                                                                <PopoverContent>
                                                                    <PopoverArrow />
                                                                    <PopoverHeader><b>Deletar Acordo #{el.id}</b></PopoverHeader>
                                                                    <PopoverCloseButton />
                                                                    <PopoverBody>
                                                                        <VStack align='flex-start' gap={3}>
                                                                            <Text fontSize='xs'>Tem certeza que deseja deletar este acordo? <b>Esta ação não poderá ser desfeita.</b></Text>
                                                                            <Button size='sm' colorScheme='red' width='full' leftIcon={<MdOutlineDeleteForever/>} onClick={() => deleteAcordo(el.id)}>
                                                                                Sim, quero deletar
                                                                            </Button>
                                                                        </VStack>
                                                                    </PopoverBody>
                                                                </PopoverContent>
                                                            </Portal>
                                                        </Popover>
                                                    </Td>
                                                </Tr>
                                            )
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Divider />
                            <Flex flexDirection='row' gap={4}>
                                <Button colorScheme='blue' leftIcon={<FaUniversity />} onClick={() => setInstituicaoModal(true)}>
                                    Adicionar Instituição
                                </Button>
                                <Button colorScheme='green' leftIcon={<FaPlus />} onClick={() => setAcordoModal(true)}>
                                    Adicionar Acordo
                                </Button>
                            </Flex>
                        </Flex>
                        <InstituicaoModal setIsOpen={setInstituicaoModal} isOpen={instituicaoModal}/>
                        <AcordoModal setIsOpen={setAcordoModal} isOpen={acordoModal}/>
                    </>
            }

            {status === "unauthenticated" &&
                <>
                    <Heading as='h1' color='red.500'>Você não tem permissão para ver esta página.</Heading>
                    <Text>Faça login e tente novamente.</Text>
                    <Link href='/'><Button colorScheme='green'>Retornar</Button></Link>
                </>
            }
        </Flex>
    )
}

export default Main;
