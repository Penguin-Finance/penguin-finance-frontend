import React from 'react'
import styled from 'styled-components'
import { Text, Input, InputProps, Flex } from 'penguinfinance-uikit2'

interface FieldInputProps {
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  inputTitle?: string
}

const InputContainer = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  /* color: ${({ theme }) => theme.colors.text}; */
  padding: 8px 16px;
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 60px;
  margin: 8px;
  padding: 0 8px;
  border: 1px solid #7645d9;
  ::placeholder {
    opacity: 0.6;
  }

  &:focus {
    box-shadow: 0px 0px 0px 1px #7645d9, 0px 0px 0px 1px rgb(118 69 217 / 60%) !important;
  }
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`

const FieldInput: React.FC<FieldInputProps> = ({ onChange, placeholder, value, inputTitle }) => {
  return (
    <div style={{ position: 'relative' }}>
      <InputContainer>
        <Flex justifyContent="space-between" pl="16px">
          <Text fontSize="14px">{inputTitle}</Text>
        </Flex>
        <Flex alignItems="flex-end" justifyContent="space-around">
          <StyledInput value={value} placeholder={placeholder} onChange={onChange} />
        </Flex>
      </InputContainer>
    </div>
  )
}

export default FieldInput
