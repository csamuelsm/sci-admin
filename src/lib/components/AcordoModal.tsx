import React, { useEffect, useState } from 'react'
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

type AcordoModalProps = {
    isOpen:boolean,
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
}

function AcordoModal(props:AcordoModalProps) {
    const toast = useToast()
    const [instituicoes, setInstituicoes] = useState<{id:number, nome:string, sigla:string, pais:string, email:string|null, telefone:string|null}[]>([]);

    useEffect(() => {
        async function getInsituicoes() {
            let res = await fetch('/api/getInstituicoes');
            let data = await res.json();
            setInstituicoes(data);
            return data;
        }

        getInsituicoes();
    }, [])

  return (
    <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Adicionar Acordo</ModalHeader>
            <ModalCloseButton/>

            <ModalBody>
                <Formik initialValues={{
                    instituicao: -1,
                    dataInicio: '',
                    dataFinal: '',
                    processo: '',
                    responsavel: '',
                }}
                    onSubmit={(values, actions) => {
                        //alert(JSON.stringify(values));

                        async function addAcordo(instituicao:number, dataInicio:Date, dataFinal:Date, processo:string, responsavel:string) {
                            let res = await fetch('/api/addAcordo', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    instituicao: instituicao,
                                    dataInicio: dataInicio,
                                    dataFinal: dataFinal,
                                    processo: processo,
                                    responsavel: responsavel
                                })
                            });
                            if (res.status != 200) {
                               toast({
                                    title: "Não foi possível cadastrar o acordo.",
                                    description: "O sistema se comportou de maneira inesperada. Tente novamente ou entre em contato com o desenvolvedor.",
                                    status: 'error',
                                    duration: 7000,
                                    isClosable: true
                               });
                            } else {
                                toast({
                                    title: "Acordo cadastrado com sucesso.",
                                    description: "O acordo foi cadastrado. Atualize a página para visualizá-lo na tabela.",
                                    status: 'success',
                                    duration: 7000,
                                    isClosable: true
                                })
                            }

                            actions.resetForm();
                            actions.setSubmitting(false);
                        }

                        let inicio = new Date(values.dataInicio);
                        let final = new Date(values.dataFinal);

                        if (final <= inicio) {
                            actions.setFieldError('dataInicio', 'A data de início deve ser anterior à data final.');
                            actions.setFieldError('dataFinal', 'A data de início deve ser anterior à data final.');
                            actions.setSubmitting(false);
                        } else {
                            let inicio = new Date(values.dataInicio);
                            let final = new Date(values.dataFinal);
                            addAcordo(values.instituicao, inicio, final, values.processo, values.responsavel);
                        }
                    }}
                >
                    {({ handleSubmit, errors, touched, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={3} align="flex-start">
                                <FormControl isInvalid={touched.instituicao && errors.instituicao !== undefined}>
                                    <FormLabel>Instituição <span color='red'>*</span></FormLabel>
                                    <Field 
                                        name="instituicao"
                                        as={Select}
                                        validate={(value:number|undefined) => {
                                            let error;

                                            if (value == undefined || value <= 0) {
                                                error = "Este campo é obrigatório.";
                                            }

                                            return error;
                                        }}
                                    >
                                        <option value={-1}>Selecione uma instituição</option>
                                        {instituicoes.map((el, idx) => {
                                            return <option value={el.id}>{el.nome} ({el.sigla})</option>
                                        })}
                                    </Field>
                                    <FormErrorMessage>{errors.instituicao}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={touched.dataInicio && errors.dataInicio !== undefined}>
                                    <FormLabel>Data de Início do Acordo <span color='red'>*</span></FormLabel>
                                    <Field
                                        name="dataInicio"
                                        as={Input}
                                        type="datetime-local"
                                        validate={(value:string|undefined) => {
                                            let error;

                                            if (value == undefined || value.length == 0) {
                                                error = "Este campo é obrigatório";
                                            }

                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>{errors.dataInicio}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={touched.dataFinal && errors.dataFinal !== undefined}>
                                    <FormLabel>Data do Final do Acordo <span color='red'>*</span></FormLabel>
                                    <Field
                                        name="dataFinal"
                                        as={Input}
                                        type="datetime-local"
                                        validate={(value:string|undefined) => {
                                            let error;

                                            if (value == undefined || value.length == 0) {
                                                error = "Este campo é obrigatório";
                                            }

                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>{errors.dataFinal}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={touched.processo && errors.processo !== undefined}>
                                    <FormLabel>Processo <span color='red'>*</span></FormLabel>
                                    <Field
                                        name="processo"
                                        as={Input}
                                        type="text"
                                        validate={(value:string|undefined) => {
                                            let error;

                                            if (value == undefined || value.length == 0) {
                                                error = "Este campo é obrigatório";
                                            }

                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>{errors.processo}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={touched.responsavel && errors.responsavel !== undefined}>
                                    <FormLabel>Responsável <span color='red'>*</span></FormLabel>
                                    <Field
                                        name="responsavel"
                                        as={Input}
                                        type="text"
                                        validate={(value:string|undefined) => {
                                            let error;

                                            if (value == undefined || value.length == 0) {
                                                error = "Este campo é obrigatório";
                                            }

                                            return error;
                                        }}
                                    />
                                    <FormErrorMessage>{errors.responsavel}</FormErrorMessage>
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

export default AcordoModal;
