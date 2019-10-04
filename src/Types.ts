
export enum ProtocolPrefix {
    SINGLE_COMMAND_ASCII = '00',
    SINGLE_COMMAND_BINARY = '01',
    PERSISTENT_ASCII = '20',
    PERSISTENT_BIN = '21'
}

export enum ProjectorInput {
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
    DYNAMIC = 'DYN',
    NATURAL = 'NAT',
    STANDARD = 'STD',
    CINEMA = 'CIN',
    GRAPHIC = 'GRA',
    'DICOM SIM' = 'DIC',
    USER = 'USR'
}

export enum ColorTemperature {
    DEFAULT = '1',
    USER1 = '04',
    USER2 = '09',
    '3200K' = '3200',
    '3300K' = '3300',
    '9200K' = '9200',
    '9300K' = '9300'
}

export enum Geometry {
    OFF = '+00000',
    KEYSTONE = '+00001',
    CURVED = '+00002',
    'PC-1' = '+00003',
    'PC-2' = '+00004',
    'PC-3' = '+00005',
    'CORNER-CORRECTION' = '+00010'
}

export enum Aspect {
    'AUTO/VID AUTO/DEFAULT' = '0',
    'NORMAL(4:3)' = '1',
    'WIDE(16:9)' = '2',
    'NATIVE(through)' = '5',
    'FULL(HV FIT)' = '6',
    'H-FIT' = '9',
    'V-FIT' = '10'
}

export enum ColorMatching {
    OFF = '+00000',
    '3COLORS' = '+00001',
    '7COLORS' = '+00002',
    'MEASURED' = '+00004'
}

export enum ScreenSetting {
    '16:10' = '0',
    '16:9' = '1',
    '4:3' = '2'
}

export enum ShutterFade {
    '0.0s(OFF)' = '0.0',
    '0.5s' = '0.5',
    '3.5s' = '3.5',
    '4.0s' = '4.0',
    '5.0s' = '5.0',
    '7.0s' = '7.0',
    '10.0s' = '10.0'
}

export enum NoSignalShutOff {
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
    'LAMP OFF' = '0',
    'In turning ON' = '1',
    'LAMP ON' = '2',
    'LAMP Cooling' = '3'
}

export enum LampStatus {
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
    'SLOW+' = '+00000',
    'SLOW-' = '+00001',
    'NORMAL+' = '+00100',
    'NORMAL-' = '+00101',
    'FAST+' = '+00200',
    'FAST-' = '+00201'
}

export enum CustomMasking {
    OFF = '+00000',
    'PC-1' = '+00001',
    'PC-2' = '+00002',
    'PC-3' = '+00003'
}

export enum EdgeBlending {
    OFF = '+00000',
    ON = '+00001',
    USER = '+00002'
}

export interface RgbValue {
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

export interface CommandOptionInterface {
    subname?: string,
    queryCommand?: string,
    setPrefix?: string,
    setCommand?: string
}

export interface ConverterInterface<T> {
    parse (value: string): T | undefined
    format (value: T | undefined): string
}

export class NumberConverter implements ConverterInterface<number> {

    private min: number
    private offset: number
    private paddingCount: number
    private includeSign: boolean

    constructor (min: number, paddingCount: number, minFormatted?: number, includeSign?: boolean) {
        this.min = min
        this.paddingCount = paddingCount
        minFormatted = minFormatted === undefined ? min : minFormatted
        this.offset = minFormatted - min

        if (includeSign !== undefined) {
            this.includeSign = includeSign
        } else {
            this.includeSign = (this.min + this.offset) < 0
        }
    }

    public parse (value: string): number | undefined {
        const result = parseInt(value, 10) - this.offset
        return isNaN(result) ? undefined : result
    }

    public format (value: number | undefined): string {
        if (value === undefined) return ''

        const offsettedValue = value + this.offset
        const signLessValue = (offsettedValue < 0) ? (-1 * offsettedValue) : offsettedValue
        let formattedValue = ('' + signLessValue).padStart(this.paddingCount, '0')
        if (this.includeSign) {
            formattedValue = (offsettedValue < 0 ? '-' : '+') + formattedValue
        }

        return formattedValue
    }
}

export class BooleanConverter implements ConverterInterface<boolean> {

    private queryOnValue: string
    private queryOffValue: string
    private setOnValue: string
    private setOffValue: string

    constructor (queryOnValue: string = '1', queryOffValue: string = '0', setOnValue?: string, setOffValue?: string) {
        this.queryOnValue = queryOnValue
        this.queryOffValue = queryOffValue
        this.setOnValue = setOnValue === undefined ? queryOnValue : setOnValue
        this.setOffValue = setOffValue === undefined ? queryOffValue : setOffValue
    }

    public parse (response: string): boolean | undefined {
        if (response === this.queryOnValue) return true
        if (response === this.queryOffValue) return false
        return undefined
    }

    public format (value: boolean | undefined): string {
        if (value === undefined) return ''
        return value ? this.setOnValue : this.setOffValue
    }
}

export const DefaultBooleanConverter = new BooleanConverter()

export class EnumConverter<T extends string> implements ConverterInterface<T> {

    public parse (value: string): T | undefined {
        return value as T
    }

    public format (value: T | undefined): string {
        if (value === undefined) return ''
        return '' + value
    }
}

class RgbConverter implements ConverterInterface<RgbValue> {

    private static baseConverter: NumberConverter = new NumberConverter(0, 4, 0)

    public parse (value: string): RgbValue | undefined {
        const parts = value.split(',')
        if (parts.length !== 3) return undefined
        return {
            R: RgbConverter.baseConverter.parse(parts[0]) || 0,
            G: RgbConverter.baseConverter.parse(parts[1]) || 0,
            B: RgbConverter.baseConverter.parse(parts[2]) || 0
        }
    }

    public format (value: RgbValue | undefined): string {
        if (value === undefined) return ''
        const parts = [
            RgbConverter.baseConverter.format(value.R),
            RgbConverter.baseConverter.format(value.G),
            RgbConverter.baseConverter.format(value.B) ]
        return parts.join(',')
    }
}

export const DefaultRgbConverter = new RgbConverter()

export class GenericCommand<T> implements GenericCommandInterface<T> {
    public name: string
    public subname: string | undefined

    private queryCommand: string
    private setCommand: string

    private converter: ConverterInterface<T>

    constructor (name: string, converter: ConverterInterface<T>, options?: CommandOptionInterface) {
        this.name = name
        this.converter = converter

        if (options === undefined) {
            options = {}
        }

        this.subname = options.subname

        this.queryCommand = options.queryCommand === undefined ? ('Q' + this.buildName(true)) : options.queryCommand

        if (options.setCommand !== undefined) {
            this.setCommand = options.setCommand
        } else {
            this.setCommand = (options.setPrefix === undefined ? 'V' : options.setPrefix)
                + this.buildName()
                + (this.subname === undefined ? ':' : '=')
        }
    }

    private buildName (query: boolean = false) {
        let name = this.name
        if (name === 'XX' && query === true) {
            name = 'VX'
        }
        return this.subname === undefined ? name : (name + ':' + this.subname)
    }

    parseResponse (response: string): T | undefined {
        let value = response

        if (this.subname !== undefined) {
            const parts = response.split('=')
            if (parts.length === 2) {
                value = parts[1]
            }
        }

        return this.converter.parse(value)
    }

    getSetCommand (value?: T | undefined): string | undefined {
        return this.setCommand
            + this.converter.format(value)
    }

    getQueryCommand (): string {
        return this.queryCommand
    }
}
