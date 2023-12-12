import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { RiEyeCloseLine } from "react-icons/ri";
import { RiEyeLine } from "react-icons/ri";
import React, { Dispatch, SetStateAction } from 'react';

type PasswordInputProps = {
    pass: string,
    setPass: Dispatch<SetStateAction<string>>
}

function PasswordInput(props: PasswordInputProps) {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
        <InputGroup size='md' w='100%'>
        <Input
            pr='4.5rem'
            type={show ? 'text' : 'password'}
            placeholder='Senha'
            w='100%'
            value={props.pass}
            onChange={(e) => props.setPass(e.target.value)}
        />
        <InputRightElement marginRight={1}>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
            {show ? <RiEyeCloseLine /> : <RiEyeLine /> }
            </Button>
        </InputRightElement>
        </InputGroup>
    )
}

export default PasswordInput
