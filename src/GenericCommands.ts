import { CommandType } from './Types'
import { ConverterInterface } from './Converters'

export interface CommandInterface {
    name: string
    subname?: string
    label: string
    type: CommandType
    getQueryCommand (): string | undefined
    parseResponse (response: string): any
    getSetCommand (value?: any | undefined): string | undefined
    getName (): string
}

export interface GenericCommandInterface<T> extends CommandInterface {
    parseResponse (response: string): T | undefined
    getSetCommand (value?: T | undefined): string | undefined
}

export interface CommandOptionInterface {
    subname?: string,
    queryCommand?: string,
    setPrefix?: string,
    setCommand?: string,
    setOperator?: string
}

export class GenericCommand<T> implements GenericCommandInterface<T> {
    public name: string
    public subname: string | undefined
    public label: string
    public type: CommandType = CommandType.Ascii

    private queryCommand: string
    private setCommand: string
    private setOperator: string

    private converter: ConverterInterface<T>

    constructor (name: string, label: string, converter: ConverterInterface<T>, options?: CommandOptionInterface) {
        this.name = name
        this.label = label
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
        }

        if (options.setOperator !== undefined) {
            this.setOperator = options.setOperator
        } else {
            this.setOperator = this.subname === undefined ? ':' : '='
        }
    }

    private buildName (query: boolean = false) {
        let name = this.name
        if (name === 'XX' && query === true) {
            name = 'VX'
        }
        return this.subname === undefined ? name : (name + ':' + this.subname)
    }

    public getName () {
        return this.buildName(false)
    }

    public parseResponse (response: string): T | undefined {
        let value = response

        if (this.subname !== undefined) {
            const parts = response.split('=')
            if (parts.length === 2) {
                value = parts[1]
            }
        }

        return this.converter.parse(value)
    }

    public getSetCommand (value?: T | undefined): string | undefined {
        const formatted = this.converter.format(value)
        return formatted === undefined
            ? this.setCommand
            : (this.setCommand + this.setOperator + formatted)
    }

    public getQueryCommand (): string {
        return this.queryCommand
    }
}

export class BinaryCommand<T> implements GenericCommandInterface<T> {
    public name: string
    public label: string
    public type: CommandType = CommandType.Binary

    private converter: ConverterInterface<T>

    constructor (name: string, label: string, converter: ConverterInterface<T>) {
        this.name = name
        this.label = label
        this.converter = converter
    }

    public getName () {
        return this.name
    }

    public parseResponse (response: string): T | undefined {
        let value = undefined
        if (response.substring(0, 2) === '02'
            && response.substring(response.length - 2) === '03'
            && response.substring(4, 4 + this.name.length) === this.name) {
            value = response.substring(4 + this.name.length, response.length - 2)
        } else {
            return undefined
        }

        return this.converter.parse(value)
    }

    public getSetCommand (value?: T | undefined): string | undefined {
        const formatted = this.converter.format(value)
        if (formatted === undefined) return undefined

        return '0200' + this.name + formatted + '03'
    }

    public getQueryCommand (): string | undefined {
        return undefined
    }
}
