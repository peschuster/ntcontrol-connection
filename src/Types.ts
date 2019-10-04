export enum ProtocolPrefix {
    SINGLE_COMMAND_ASCII = '00',
    SINGLE_COMMAND_BINARY = '01',
    PERSISTENT_ASCII = '20',
    PERSISTENT_BIN = '21'
}

export enum ProjectorInput {
    UNKOWN = '',
    COMPUTER1 = 'RG1',
    COMPUTER2 = 'RG2',
    VIDEO = 'VID',
    'Y/C' = 'SVD',
    DVI = 'DVI',
    HDMI1 = 'HD1',
    SDI1 = 'SD1',
    SDI2 = 'SD2',
    'DIGITAL LINK' = 'DL1'
}

export enum PictureMode {
    UNKOWN = '',
    DYNAMIC = 'DYN',
    NATURAL = 'NAT',
    STANDARD = 'STD',
    CINEMA = 'CIN',
    GRAPHIC = 'GRA',
    'DICOM SIM' = 'DIC',
    USER = 'USR'
}

export enum ColorTemperature {
    UNKOWN = '',
    DEFAULT = '1',
    USER1 = '04',
    USER2 = '09',
    '3200K' = '3200',
    '3300K' = '3300',
    '9200K' = '9200',
    '9300K' = '9300'
}

export enum Geometry {
    UNKOWN = '',
    OFF = '+00000',
    KEYSTONE = '+00001',
    CURVED = '+00002',
    'PC-1' = '+00003',
    'PC-2' = '+00004',
    'PC-3' = '+00005',
    'CORNER-CORRECTION' = '+00010'
}

export enum Aspect {
    UNKOWN = '',
    'AUTO/VID AUTO/DEFAULT' = '0',
    'NORMAL(4:3)' = '1',
    'WIDE(16:9)' = '2',
    'NATIVE(through)' = '5',
    'FULL(HV FIT)' = '6',
    'H-FIT' = '9',
    'V-FIT' = '10'
}

export enum ColorMatching {
    UNKOWN = '',
    OFF = '+00000',
    '3COLORS' = '+00001',
    '7COLORS' = '+00002',
    'MEASURED' = '+00004'
}

export enum ScreenSetting {
    UNKOWN = '',
    '16:10' = '0',
    '16:9' = '1',
    '4:3' = '2'
}

export enum ShutterFade {
    UNKOWN = '',
    '0.0s(OFF)' = '0.0',
    '0.5s' = '0.5',
    '3.5s' = '3.5',
    '4.0s' = '4.0',
    '5.0s' = '5.0',
    '7.0s' = '7.0',
    '10.0s' = '10.0'
}

export enum NoSignalShutOff {
    UNKOWN = '',
    DISABLE = '00',
    '10min' = '10',
    '20min' = '20',
    '30min' = '30',
    '40min' = '40',
    '50min' = '50',
    '60min' = '60',
    '70min' = '70',
    '80min' = '80',
    '90min' = '90'
}

export enum LensMemory {
    UNKOWN = '',
    'LENS MEMORY1' = '+00000',
    'LENS MEMORY2' = '+00001',
    'LENS MEMORY3' = '+00002',
    'LENS MEMORY4' = '+00003',
    'LENS MEMORY5' = '+00004',
    'LENS MEMORY6' = '+00005',
    'LENS MEMORY7' = '+00006',
    'LENS MEMORY8' = '+00007',
    'LENS MEMORY9' = '+00008',
    'LENS MEMORY10' = '+00009'
}

export enum LampControlStatus {
    UNKOWN = '',
    'LAMP OFF' = '0',
    'In turning ON' = '1',
    'LAMP ON' = '2',
    'LAMP Cooling' = '3'
}

export enum LampStatus {
    UNKOWN = '',
    'ALL OFF' = '0',
    'ALL ON' = '1',
    '1:ON, 4:ON' = '2',
    '2:ON, 3:ON' = '3',
    '1:ON, 2:ON, 3:ON' = '4',
    '1:ON, 2:ON, 4:ON' = '5',
    '1:ON, 3:ON, 4:ON' = '6',
    '2:ON, 3:ON, 4:ON' = '7',
    '1:ON' = '8',
    '2:ON' = '9',
    '3:ON' = '10',
    '4:ON' = '11'
}

export enum TestPattern {
    UNKOWN = '',
    Off = '00',
    White = '01',
    Black = '02',
    Flag = '03',
    'Reversed Flag' = '04',
    Window = '05',
    'Reversed Window' = '06',
    'Cross Hatch' = '07',
    'Color Bar V' = '08',
    Lamp = '09',
    Red = '22',
    Green = '23',
    Blue = '24',
    '10%-Liminance' = '25',
    '5%-Luminance' = '26',
    'Color Bar Side' = '51',
    '3D-1' = '80',
    '3D-2' = '81',
    '3D-3' = '82',
    '3D-4' = '83'
}

export enum ActionSpeed {
    UNKOWN = '',
    'SLOW+' = '+00000',
    'SLOW-' = '+00001',
    'NORMAL+' = '+00100',
    'NORMAL-' = '+00101',
    'FAST+' = '+00200',
    'FAST-' = '+00201'
}

export enum CustomMasking {
    UNKOWN = '',
    OFF = '+00000',
    'PC-1' = '+00001',
    'PC-2' = '+00002',
    'PC-3' = '+00003'
}

export enum EdgeBlending {
    UNKOWN = '',
    OFF = '+00000',
    ON = '+00001',
    USER = '+00002'
}

export interface RgbTupple {
    R: number
    G: number
    B: number
}

export interface CommandInterface {
    name: string
    getQueryCommand (): string
    parseResponse (response: string): any
    getSetCommand (value?: any | undefined): string | undefined
}

export interface GenericCommandInterface<T> extends CommandInterface {
    parseResponse (response: string): T | undefined
    getSetCommand (value?: T | undefined): string | undefined
}

export class BaseCommand {
    public name: string

    protected queryCommandBuilder: () => string

    constructor (name: string, queryCommandBuilder: () => string) {
        this.name = name
        this.queryCommandBuilder = queryCommandBuilder
    }

    public getQueryCommand (): string {
        return this.queryCommandBuilder()
    }
}

export class BooleanCommand extends BaseCommand implements GenericCommandInterface<Boolean> {
    public name: string
    public valueOn: string
    public valueOff: string
    public supportsToggle: boolean

    protected setCommandBuilder: (v: boolean | undefined) => string
    protected resultParser: (v: string) => boolean

    constructor (
        name: string,
        valueOn: string = '1',
        valueOff: string = '0',
        setCommandBuilder?: (v: boolean | undefined) => string,
        queryCommandBuilder?: () => string,
        resultParser?: (v: string) => boolean) {

        super(name, (queryCommandBuilder !== undefined) ? queryCommandBuilder : () => 'Q' + this.name)

        this.name = name
        this.valueOn = valueOn
        this.valueOff = valueOff

        if (setCommandBuilder !== undefined) this.setCommandBuilder = setCommandBuilder
        else this.setCommandBuilder = (value) => 'O' + this.name + (value === undefined ? '' : (':' + (value ? this.valueOn : this.valueOff)))

        if (resultParser !== undefined) this.resultParser = resultParser
        else this.resultParser = (response: string) => response === this.valueOn
    }

    public parseResponse (response: string): boolean {
        return this.resultParser(response)
    }

    public getSetCommand (value?: boolean | undefined): string {
        return this.setCommandBuilder(value)
    }
}

export class EnumCommand<T extends string> extends BaseCommand implements GenericCommandInterface<T> {
    private setPrefix: string
    private subname: string | undefined
    constructor (
        name: string,
        queryCommand?: string | undefined,
        subname?: string | undefined,
        setPrefix: string = 'V') {

        if (queryCommand === undefined) queryCommand = 'Q' + (name === 'XX' ? 'VX' : name)
        super(name, () => queryCommand + (subname === undefined ? '' : (':' + subname)))

        this.subname = subname
        this.setPrefix = setPrefix
    }

    public parseResponse (response: string): T {
        let value = response

        if (this.subname !== undefined) {
            const parts = response.split('=')
            if (parts.length === 2) {
                value = parts[1]
            }
        }

        return value as T
    }

    public getSetCommand (value?: T | undefined): string | undefined {
        if (value !== undefined) {
            if (this.subname !== undefined) {
                return this.setPrefix + this.name + ':' + this.subname + '=' + value
            } else {
                return this.setPrefix + this.name + ':' + value
            }
        }
        return undefined
    }
}

export class NumberRangeCommand extends BaseCommand implements GenericCommandInterface<Number> {
    public min: number
    public max: number
    public paddingCount: number
    private offset: number
    private setPrefix: string
    private subname: string | undefined
    private includeSign: boolean

    constructor (
        name: string,
        min: number,
        max: number,
        minFormated: number = 0,
        paddingCount: number = 3,
        subname?: string | undefined,
        setPrefix: string = 'V',
        queryCommand?: string | undefined,
        forceSign?: boolean) {

        if (queryCommand === undefined) queryCommand = 'Q' + (name === 'XX' ? 'VX' : name)
        super(name, () => queryCommand + (subname === undefined ? '' : (':' + subname)))

        this.min = min
        this.max = max
        this.paddingCount = paddingCount
        this.subname = subname
        this.setPrefix = setPrefix

        this.offset = minFormated - min

        if (forceSign !== undefined) {
            this.includeSign = forceSign
        } else {
            this.includeSign = (this.min + this.offset) < 0
        }
    }

    public parseResponse (response: string): number {
        let value = response

        if (this.subname !== undefined) {
            const parts = response.split('=')
            if (parts.length === 2) {
                value = parts[1]
            }
        }

        return parseInt(value, 10) - this.offset
    }

    public getSetCommand (value: number): string | undefined {
        if (value !== undefined) {

            const offsettedValue = value + this.offset
            const signLessValue = (offsettedValue < 0) ? (-1 * offsettedValue) : offsettedValue
            let formattedValue = ('' + signLessValue).padStart(this.paddingCount, '0')
            if (this.includeSign) {
                formattedValue = (offsettedValue < 0 ? '-' : '+') + formattedValue
            }

            if (this.subname !== undefined) {
                return this.setPrefix + this.name + ':' + this.subname + '=' + formattedValue
            } else {
                return this.setPrefix + this.name + ':' + formattedValue
            }
        }
        return undefined
    }
}

export class RgbCommand extends BaseCommand implements GenericCommandInterface<RgbTupple> {
    private subname: string | undefined

    constructor (
        name: string,
        subname?: string | undefined,
        queryCommand?: string | undefined) {

        if (queryCommand === undefined) queryCommand = 'Q' + (name === 'XX' ? 'VX' : name)
        super(name, () => queryCommand + (subname === undefined ? '' : (':' + subname)))

        this.subname = subname
    }

    public parseResponse (response: string): RgbTupple | undefined {
        let value = response

        if (this.subname !== undefined) {
            const parts = response.split('=')
            if (parts.length === 2) {
                value = parts[1]
            }
        }

        const tuple = value.split(',')
        if (tuple.length !== 3) {
            return undefined
        }

        return {
            R: parseInt(tuple[0], 10),
            G: parseInt(tuple[1], 10),
            B: parseInt(tuple[2], 10)
        }
    }

    private formatValue (value: number): string {
        const signLessValue = (value < 0) ? (-1 * value) : value
        let formattedValue = ('' + signLessValue).padStart(4, '0')
        if (value < 0) {
            formattedValue = '-' + formattedValue
        }
        return formattedValue
    }

    public getSetCommand (value: RgbTupple): string | undefined {
        if (value !== undefined) {
            const parts = [ this.formatValue(value.R), this.formatValue(value.G), this.formatValue(value.B) ]
            const formattedValue = parts.join(',')

            if (this.subname !== undefined) {
                return 'V' + this.name + ':' + this.subname + '=' + formattedValue
            } else {
                return 'V' + this.name + ':' + formattedValue
            }
        }
        return undefined
    }
}
