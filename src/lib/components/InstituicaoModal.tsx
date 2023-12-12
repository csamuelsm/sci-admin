import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
    VStack,
    Select,
    useToast
} from '@chakra-ui/react';
import { Formik, Field, Form, FieldProps } from 'formik';
import paises from './utils/paises-array.json';

type InstituicaoModalProps = {
    isOpen:boolean,
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
}

function InstituicaoModal(props:InstituicaoModalProps) {
    const toast = useToast()
  return (
    <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Adicionar Instituição</ModalHeader>
            <ModalCloseButton/>

            <ModalBody>
                <Formik initialValues={{
                    name: '',
                    sigla: '',
                    pais: '',
                    email: undefined,
                    telefone: undefined
                }}
                    onSubmit={(values, actions) => {
                        async function createInstituicao(nome:string, sigla:string, pais:string, email:string|undefined, telefone:string|undefined) {
                            
                            let res = await fetch('/api/addInstituicao', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    nome: nome,
                                    sigla: sigla.toUpperCase(),
                                    pais: pais,
                                    email: email,
                                    telefone: telefone
                                })
                            })

                            if (res.status != 200) {
                                toast({
                                    title: "Algo deu errado.",
                                    description: "O sistema se comportou de maneira inesperada. Por favor, tente novamente ou entre em contato com o desenvolvedor.",
                                    status: 'error',
                                    duration: 7000,
                                    isClosable: true
                                })
                            } else {
                                toast({
                                    title: "Sucesso!",
                                    description: "A instituição foi cadastrada.",
                                    status: 'success',
                                    duration: 7000,
                                    isClosable: true
                                })
                            }

                            actions.setSubmitting(false);
                            actions.resetForm();
                        }

                        createInstituicao(values.name, values.sigla, values.pais, values.email, values.telefone);
                    }}
                >
                    {({ handleSubmit, errors, touched, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={3} align="flex-start">
                                <FormControl isInvalid={touched.name && errors.name !== undefined}>
                                    <FormLabel>Nome da Instituição <span color='red'>*</span></FormLabel>
                                    <Field 
                                        name="name"
                                        as={Input}
                                        type="text"
                                        validate={(value:string|undefined) => {
                                            let error;

                                            if (value == undefined || value.length == 0) {
                                                error = "Este campo é obrigatório.";
                                            }

                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={touched.sigla && errors.sigla !== undefined}>
                                    <FormLabel>Sigla da Instituição <span color='red'>*</span></FormLabel>
                                    <Field 
                                        name="sigla"
                                        as={Input}
                                        type="text"
                                        validate={(value:string) => {
                                            let error;

                                            if (value == undefined || value.length == 0) {
                                                error = "Este campo é obrigatório.";
                                            }

                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>{errors.sigla}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={touched.pais && errors.pais !== undefined}>
                                    <FormLabel>País da Instituição <span color='red'>*</span></FormLabel>
                                    <Field
                                        name="pais"
                                        as={Select}
                                        validate={(value:string|undefined) => {
                                            let error;

                                            if (value == undefined || value.length == 0) {
                                                error = "Este campo é obrigadtório.";
                                            }

                                            return error;
                                        }}
                                    >
                                        <option value={undefined}>Selecione um país</option>
                                        {paises.map((el, idx) => {
                                            return (
                                                <option value={`${el.nome} (${el.sigla2})`}>{`${el.nome} (${el.sigla2})`}</option>
                                            )
                                        })}
                                    </Field>
                                    <FormErrorMessage>{errors.pais}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={touched.email && errors.email !== undefined}>
                                    <FormLabel>E-mail para Contato</FormLabel>
                                    <Field 
                                        name="email"
                                        as={Input}
                                        type="email"
                                        validate={(value:string) => {
                                            let error;
                                            const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");

                                            if (value != undefined && value.length > 0 && !emailRegex.test(value)) {
                                                error = "Este e-mail não é válido.";
                                            }

                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Telefone para Contato</FormLabel>
                                    <Field 
                                        name="telefone"
                                        as={Input}
                                        type="text"
                                    />
                                </FormControl>
                                <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                                    Cadastrar
                                </Button>
                            </VStack>
                        </form>
                    )}
                </Formik>
            </ModalBody>

            {/*<ModalFooter>
                <Text>Footer</Text>
            </ModalFooter>*/}
        </ModalContent>
    </Modal>
  )
}

export default InstituicaoModal;
