import React, { useState } from 'react';
import {
    Box,
    Text,
    Link,
    VStack,
    Code,
    Grid,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Tfoot,
    Flex,
    Input,
    Tooltip,
    Button
} from '@chakra-ui/react';
import RenderRx from './RenderRx';
const potenciasDeDos = ['1', '2', '4', '8', '16', '32']
const potenciasDeDosStr = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']

const initRowsValue = {
    ['n+p']: [],
    posicion: [],
    binario: [],
    n: [],
    p1: [],
    p2: [],
    p3: [],
    p4: [],
    tx: [],
}

export default function Home() {
    const [rows, setRows] = useState(initRowsValue)
    const [TX, setTX] = useState([])

    const handleChangeStringToSend = ({ target }) => {
        let chars = [...target.value.split('')].reverse()
        if (chars.length == 0) {
            setRows({ ...initRowsValue })
            setTX([])
            return
        }
        if (chars.length > 10 || !/^[01]*$/.test(target.value)) return
        const arrayStringWithParities = []
        const arrayStringParitiesAndNumbers = []
        let position = 1
        let numbers = 1

        let rowsValue = {
            ['n+p']: [],
            posicion: [],
            binario: [],
            n: [],
            p1: [],
            p2: [],
            p3: [],
            p4: [],
            tx: [],
        }

        while (chars.length > 0) {
            const parIndex = potenciasDeDos.findIndex(f => f == position)
            if (parIndex !== -1) {
                arrayStringWithParities.unshift('p')
                arrayStringParitiesAndNumbers.unshift(potenciasDeDosStr[parIndex])
            } else {
                arrayStringWithParities.unshift(chars[0])
                arrayStringParitiesAndNumbers.unshift(`n${numbers}`)
                chars.shift()
                numbers++
            }
            position++
        }

        rowsValue['n+p'] = arrayStringParitiesAndNumbers

        arrayStringParitiesAndNumbers.forEach((item, i) => {
            const position = arrayStringParitiesAndNumbers.length - i
            rowsValue['posicion'].push(position)
            rowsValue['binario'].push(binaryWithZeros(position))
            rowsValue['n'].push(item.includes('n') ? arrayStringWithParities[i] : '')
            rowsValue['p1'].push(binaryWithZeros(position)[3] == '1' ? arrayStringWithParities[i] : '')
            rowsValue['p2'].push(binaryWithZeros(position)[2] == '1' ? arrayStringWithParities[i] : '')
            rowsValue['p3'].push(binaryWithZeros(position)[1] == '1' ? arrayStringWithParities[i] : '')
            rowsValue['p4'].push(binaryWithZeros(position)[0] == '1' ? arrayStringWithParities[i] : '')
        });

        rowsValue['p1'] = resolveParities(rowsValue['p1'])
        rowsValue['p2'] = resolveParities(rowsValue['p2'])
        rowsValue['p3'] = resolveParities(rowsValue['p3'])
        rowsValue['p4'] = resolveParities(rowsValue['p4'])

        rowsValue['tx'] = resolveTX(rowsValue)
        setTX(rowsValue['tx'])
        setRows({ ...rowsValue })
    }

    return (
        <Flex justify={'center'} w={'100vw'} h={'100vh'} position={'relative'}>
            <Box textAlign="center" fontSize="xl" w={['95vw', '90vw', '85vw', '80vw', '80vw']}>
                <Input value={rows['n'].join('')} onChange={handleChangeStringToSend} placeholder='cadena a enviar max 10bits' my={'15px'} />
                <Flex flexDir={'column'}>
                    <RenderTable rows={rows} />
                    <Flex flexDir={'column'}>
                        <Text my={'15px'}>Vas a transmitir:</Text>
                        <Flex justifyContent={'space-evenly'} w={'100%'}>
                            {
                                TX && TX.map((tx, i) => {
                                    return (
                                        <Tooltip label='click para insertar error'>
                                            <Text
                                                border={'1px solid #000'}
                                                py={2}
                                                px={3}
                                                cursor={'pointer'}
                                                onClick={() => setTX(prev => prev.map((t, j) => j == i ? t == 0 ? '1' : '0' : t))}
                                                bg={tx == rows['tx'][i] ? '#fff' : 'red.200'}
                                                userSelect={'none'}
                                            >
                                                {tx}
                                            </Text>
                                        </Tooltip>
                                    )
                                })
                            }
                        </Flex>
                    </Flex>
                    {
                        TX.length > 0 &&
                        < RenderRx TX={TX} txSinErr={rows['tx']} />
                    }
                </Flex>
            </Box>
            <Flex bg={'lightgray'} w={'80px'} h={'55px'} borderRadius={'15px'} position={'absolute'} right={10} bottom={10} justify={'center'} align={'center'} cursor={'pointer'}>
                <Text fontWeight={'bold'}>
                    about
                </Text>
            </Flex>
        </Flex>
    );
}

function binaryWithZeros(decimal) {
    let binary = decimal.toString(2)
    switch (binary.length) {
        case 1:
            return `000${binary}`
        case 2:
            return `00${binary}`
        case 3:
            return `0${binary}`
        default:
            return binary
    }
}

function resolveParities(arr) {
    const coutOne = arr.reduce((count, val) => val === '1' ? count + 1 : count, 0);
    return arr.map(val => val === 'p' ?
        (coutOne % 2) === 0 ?
            '0'
            : '1'
        : val)
}

function resolveTX(rows) {
    let tx = []
    const rowsCopy = { ...rows }
    delete rowsCopy['binario']
    delete rowsCopy['n']
    delete rowsCopy['n+p']
    delete rowsCopy['posicion']
    delete rowsCopy['tx']
    for (const key in rows) {
        rows[key].forEach((item, i) => {
            if (item.length > 0) tx[i] = item
        })
    }
    return tx
}

const RenderTable = ({ rows }) => {
    return (
        <TableContainer border={'1px solid gray'}>
            <Table variant='simple' >
                <Thead>
                    <Tr>
                        <Th>n+p</Th>
                        {
                            rows['n+p'].map((char, i) => {
                                return (
                                    <>
                                        < Th bg={rows['n+p'][i].includes('p') && 'blue.100'}>{char}</Th >
                                    </>
                                )
                            })
                        }
                    </Tr>
                    <Tr>
                        <Th>Posicion</Th>
                        {
                            rows['posicion'].map((char, i) => {
                                return (
                                    < Th bg={rows['n+p'][i].includes('p') && 'blue.100'}>{char}</Th >
                                )
                            })
                        }
                    </Tr>
                    <Tr>
                        <Th>Binario</Th>
                        {
                            rows['binario'].map((char, i) => {
                                return (
                                    <Th bg={rows['n+p'][i].includes('p') && 'blue.100'}>{char}</Th>
                                )
                            })
                        }
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>n</Td>
                        {
                            rows['n'].map((char, i) => {
                                return (
                                    <Th bg={rows['n+p'][i].includes('p') && 'blue.100'}>{char}</Th>
                                )
                            })
                        }
                    </Tr>
                    <Tr>
                        <Td>p1</Td>
                        {
                            rows['p1'].map((char, i) => {
                                return (
                                    <Th bg={rows['n+p'][i].includes('p') && 'blue.100'}>{char}</Th>
                                )
                            })
                        }
                    </Tr>
                    <Tr>
                        <Td>p2</Td>
                        {
                            rows['p2'].map((char, i) => {
                                return (
                                    <Th bg={rows['n+p'][i].includes('p') && 'blue.100'}>{char}</Th>
                                )
                            })
                        }
                    </Tr>
                    <Tr>
                        <Td>p3</Td>
                        {
                            rows['p3'].map((char, i) => {
                                return (
                                    <Th bg={rows['n+p'][i].includes('p') && 'blue.100'}>{char}</Th>
                                )
                            })
                        }
                    </Tr>
                    <Tr>
                        <Td>p4</Td>
                        {
                            rows['p4'].map((char, i) => {
                                return (
                                    <Th bg={rows['n+p'][i].includes('p') && 'blue.100'}>{char}</Th>
                                )
                            })
                        }
                    </Tr>
                    <Tr>
                        <Td>TX</Td>
                        {
                            rows['tx'].map((char, i) => {
                                return (
                                    <Th bg={rows['n+p'][i].includes('p') && 'blue.100'}>{char}</Th>
                                )
                            })
                        }
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    )
}