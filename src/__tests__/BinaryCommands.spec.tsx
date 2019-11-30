import * as Command from '../Commands'
import { CommandType, GridSettings, DisplayGridLines } from '../Types'

test('GRID SETTINGS specification', () => {
    const cmd = Command.GridSettingsCommand
    expect(cmd.type).toBe(CommandType.Binary)

    // Query
    expect(cmd.getQueryCommand()).toBe(undefined)

    // Set
    let value: GridSettings = { mode: DisplayGridLines.OFF, verticalLines: 11, horizontalLines: 11 }
    expect(cmd.getSetCommand(value)).toBe('0200AB07000B0BFFFFFF03')

    value = { mode: DisplayGridLines.Red, verticalLines: 9, horizontalLines: 3 }
    expect(cmd.getSetCommand(value)).toBe('0200AB07010903FF000003')

    // Parse
    expect(cmd.parseResponse('0200AB07000B0BFFFFFF03'))
        .toStrictEqual({ mode: DisplayGridLines.OFF, verticalLines: 11, horizontalLines: 11 })
    expect(cmd.parseResponse('0200AB070103050000FF03'))
        .toStrictEqual({ mode: DisplayGridLines.Blue, verticalLines: 3, horizontalLines: 5 })

    // Unknown formats
    value = { mode: DisplayGridLines.Red, verticalLines: 500, horizontalLines: 3 }
    expect(cmd.getSetCommand(value)).toBe(undefined)
    expect(cmd.parseResponse('0200AB0701030500G0FF03')).toBe(undefined)
    expect(cmd.parseResponse('0200AB070103050000FF05')).toBe(undefined)

    // Test name
    expect(cmd.getName()).toBe('AB07')
})

test('STATUS DISPLAY specification', () => {
    const cmd = Command.StatusDisplayCommand
    expect(cmd.type).toBe(CommandType.Binary)

    // Query
    expect(cmd.getQueryCommand()).toBe(undefined)

    // Set
    expect(cmd.getSetCommand(true)).toBe('0200D0F30103')
    expect(cmd.getSetCommand(false)).toBe('0200D0F00003')

    // Parse
    expect(cmd.parseResponse('0201D0F00003')).toBe(false)
    expect(cmd.parseResponse('0204D0F30103')).toBe(true)
})
