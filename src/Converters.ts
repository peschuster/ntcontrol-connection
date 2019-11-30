import { RgbValue, GridSettings, DisplayGridLines } from './Types'

export interface ConverterInterface<T> {
    parse (value: string): T | undefined
    format (value: T | undefined): string | undefined
}

class StringConverter implements ConverterInterface<string> {

    public parse (value: string): string | undefined {
        return value
    }

    public format (value: string | undefined): string | undefined {
        return value
    }
}

export const DefaultStringConverter = new StringConverter()

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

    public format (value: number | undefined): string | undefined {
        if (value === undefined) return undefined

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

    public format (value: boolean | undefined): string | undefined {
        if (value === undefined) return undefined
        return value ? this.setOnValue : this.setOffValue
    }
}

export const DefaultBooleanConverter = new BooleanConverter()

export class EnumConverter<T extends string> implements ConverterInterface<T> {

    public parse (value: string): T | undefined {
        return value as T
    }

    public format (value: T | undefined): string | undefined {
        if (value === undefined) return undefined
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

    public format (value: RgbValue | undefined): string | undefined {
        if (value === undefined) return undefined
        const parts = [
            RgbConverter.baseConverter.format(value.R),
            RgbConverter.baseConverter.format(value.G),
            RgbConverter.baseConverter.format(value.B) ]
        return parts.join(',')
    }
}

export const DefaultRgbConverter = new RgbConverter()

class GridSettingsConverter implements ConverterInterface<GridSettings> {
    parse (value: string): GridSettings | undefined {
        if (!/^[0-9A-F]{12}$/.test(value)) return undefined

        const enabled = value.substring(0, 2) === '01'
        const color = value.substring(6, 12)

        const result = {
            mode: enabled ? (color as DisplayGridLines) : DisplayGridLines.OFF,
            verticalLines: parseInt(value.substring(2, 4), 16),
            horizontalLines: parseInt(value.substring(4, 6), 16)
        }

        return result
    }

    format (value: GridSettings | undefined): string | undefined {
        if (value === undefined || value.horizontalLines > 255 || value.verticalLines > 255) {
            return undefined
        }

        return (value.mode === DisplayGridLines.OFF ? '00' : '01')
            + value.verticalLines.toString(16).toUpperCase().padStart(2, '0')
            + value.horizontalLines.toString(16).toUpperCase().padStart(2, '0')
            + value.mode
    }
}

export const DefaultGridSettingConverter = new GridSettingsConverter()
