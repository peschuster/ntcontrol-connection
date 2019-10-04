
export enum ResponseCode {
    ERR1 = 'ERR1',
    ERR2 = 'ERR2',
    ERR3 = 'ERR3',
    ERR4 = 'ERR4',
    ERR5 = 'ERR5',
    ERRA = 'ERRA',
    ER401 = 'ER401'
}

export function getResponseDescription (code: ResponseCode): string | undefined {
    switch (code) {
        case ResponseCode.ERR1: return 'Undefined control command'
        case ResponseCode.ERR2: return 'Parameter out of range'
        case ResponseCode.ERR3: return 'Busy state or unavailable period'
        case ResponseCode.ERR4: return 'Time out or unavailable period'
        case ResponseCode.ERR5: return 'Invalid data length'
        case ResponseCode.ERRA: return 'Mismatching state of a password'
        case ResponseCode.ER401: return 'Error occurred on processing command'
    }

    return undefined
}
