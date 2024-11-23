import React, { useEffect, useState } from 'react';
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
    rx: [],
}

export default function RenderRx({ TX }) {
    const [rowsRX, setRowsRX] = useState(initRowsValue)
    const [RX, setRX] = useState([])
    const [message, setMessage] = useState({ msg: '', err: false, ind: [] })

    const handleSetErr = (err, ind) => {
        const msgSucces = 'MENSAJE SIN ERROR!!✨'
        const msgError = 'MENSAJE CON ERROR!!🤦‍♂️'
        setMessage({ msg: err ? msgError : msgSucces, err: err, ind: ind })
    }

    const handleTransmit = () => {
        let chars = [...TX].reverse()
        if (chars.length == 0) {
            setRowsRX({ ...initRowsValue })
            setRX([])
            return
        }
        const stringWithParities = []
        const stringParitiesAndNumbers = []
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
            rx: [],
        }

        for (let i = 0; i < chars.length; i++) {
            const parIndex = potenciasDeDos.findIndex(f => f == position)
            if (parIndex !== -1) {
                stringWithParities.unshift('p')
                stringParitiesAndNumbers.unshift(potenciasDeDosStr[parIndex])
            } else {
                stringWithParities.unshift(chars[i])
                stringParitiesAndNumbers.unshift(`n${numbers}`)
                numbers++
            }
            position++
        }

        rowsValue['n+p'] = stringParitiesAndNumbers

        stringParitiesAndNumbers.forEach((item, i) => {
            const position = stringParitiesAndNumbers.length - i
            rowsValue['posicion'].push(position)
            rowsValue['binario'].push(binaryWithZeros(position))
            rowsValue['n'].push(item.includes('n') ? stringWithParities[i] : '')
            rowsValue['p1'].push(binaryWithZeros(position)[3] == '1' ? stringWithParities[i] : '')
            rowsValue['p2'].push(binaryWithZeros(position)[2] == '1' ? stringWithParities[i] : '')
            rowsValue['p3'].push(binaryWithZeros(position)[1] == '1' ? stringWithParities[i] : '')
            rowsValue['p4'].push(binaryWithZeros(position)[0] == '1' ? stringWithParities[i] : '')
        });

        rowsValue['p1'] = resolveParities(rowsValue['p1'])
        rowsValue['p2'] = resolveParities(rowsValue['p2'])
        rowsValue['p3'] = resolveParities(rowsValue['p3'])
        rowsValue['p4'] = resolveParities(rowsValue['p4'])

        rowsValue['rx'] = resolveTX(rowsValue);
        const rowsValueReverse = [...rowsValue['rx']].reverse()
        let parities = {}
        rowsValueReverse.forEach((val, i) => {
            const parIndex = potenciasDeDos.findIndex(f => f == (i + 1))
            if (parIndex !== -1) {
                parities[i] = val
            }
        })

        const ind = []
        const TXReverse = [...TX].reverse()
        for (let parityI in parities) {
            if (parities[parityI] != TXReverse[parityI]) {
                ind.push(parityI)
            }
        }
        handleSetErr(ind.length > 0, ind)

        setRX(rowsValue['rx'])
        setRowsRX({ ...rowsValue })
    }

    return (
        <Flex flexDir={'column'}>
            <Button my={'15px'} onClick={handleTransmit}>Transmitir</Button>
            <RenderTable rows={rowsRX} ind={message.ind} />
            <Text my={'25px'}>{message.msg}</Text>
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
    let rx = []
    const rowsCopy = { ...rows }
    delete rowsCopy['binario']
    delete rowsCopy['n']
    delete rowsCopy['n+p']
    delete rowsCopy['posicion']
    delete rowsCopy['rx']
    for (const key in rows) {
        rows[key].forEach((item, i) => {
            if (item.length > 0) rx[i] = item
        })
    }
    return rx
}

const RenderTable = ({ rows, ind }) => {
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
                        <Td>RX</Td>
                        {
                            rows['rx'].map((char, i) => {
                                return (
                                    <Th bg={(ind.includes((rows['rx'].length - 1 - i) + '') && 'red.200' || rows['n+p'][i].includes('p') && 'blue.100')}>{char}</Th>
                                )
                            })
                        }
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    )
}