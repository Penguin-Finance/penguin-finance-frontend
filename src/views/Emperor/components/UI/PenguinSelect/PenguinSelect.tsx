import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropDownIcon, Text, Flex } from 'penguinfinance-uikit2'
import { penguinImages } from '../../utils';

const DropDownHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid #7645d9;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.input};
  transition: border-radius 0.15s;
`

const DropDownListContainer = styled.div`
  min-width: 262px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 262px;
  }
`

const SelectedText = styled.div<{ selectedOption?: string }>`
  opacity: ${props => props.selectedOption ? 1 : 0.5};
  margin-left: ${props => props.selectedOption && '16px'};
`;

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  width: ${({ width }) => width}px;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  height: 40px;
  width: 100%;
  user-select: none;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid #7645d9;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        border-radius: 16px 16px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        max-height: 240px;
        overflow-y: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid #7645d9;
        border-top-width: 0;
        border-radius: 0 0 16px 16px;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};

        @media (max-height: 900px) {
          max-height: 180px;
        }

        &::-webkit-scrollbar {
          width: 4px;
        }
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const InputContainer = styled.div`
  width: 100%;
  position: relative;
`;

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

const PenguinLabel = styled(Text)`
  margin-left: 16px;
`;

export interface SelectProps {
  value?: string
  placeholder?: string
  options: OptionProps[]
  onChange?: (option: string) => void
}

export interface OptionProps {
  label: string
  value: any
}

const PenguinSelect: React.FunctionComponent<SelectProps> = ({ value, options, placeholder, onChange }) => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const toggling = () => setIsOpen(!isOpen)

  const onOptionClicked = (option: OptionProps) => () => {
    setIsOpen(false)

    if (onChange) {
      onChange(option.value)
    }
  }

  useEffect(() => {
    setContainerSize({
      width: dropdownRef.current.offsetWidth, // Consider border
      height: dropdownRef.current.offsetHeight,
    })
  }, [])

  const getPenguinName = penguinId => {
    const penguinItem = penguinImages.find(penguin => penguin.id === penguinId);
    return penguinItem.normalSrc;
  };

  const selectedOption = options.find(option => option.value === value);
  return (
    <>
      <Flex justifyContent="space-between" mb="8px" pl='8px'>
        <Text fontSize="14px">Style</Text>
      </Flex>
      <DropDownContainer isOpen={isOpen} ref={containerRef} {...containerSize}>
        <InputContainer>
          <DropDownHeader onClick={toggling}>
            {selectedOption && 
              <img
                src={`${process.env.PUBLIC_URL}/images/emperor/penguins/${getPenguinName(selectedOption.value)}.svg`}
                width="20px"
                height="20px"
                alt='penguin'
              />
            }
            <SelectedText selectedOption={selectedOption && selectedOption.label}>{selectedOption ? selectedOption.label : placeholder || ""}</SelectedText>
          </DropDownHeader>
          <ArrowDropDownIcon color="text" onClick={toggling} />
        </InputContainer>
        <DropDownListContainer>
          <DropDownList ref={dropdownRef}>
            {options.map((option) =>
              option.value !== value ? (
                <ListItem onClick={onOptionClicked(option)} key={option.label}>
                  <Flex alignItems='center'>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/emperor/penguins/${getPenguinName(option.value)}.svg`}
                      width="20px"
                      height="20px"
                      alt='penguin'
                    />
                    <PenguinLabel>{option.label}</PenguinLabel>
                  </Flex>
                </ListItem>
              ) : null,
            )}
          </DropDownList>
        </DropDownListContainer>
      </DropDownContainer>
    </>
  )
}

export default PenguinSelect
