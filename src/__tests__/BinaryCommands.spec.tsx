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
})
