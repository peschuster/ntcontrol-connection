import * as Command from '../Commands'
import { ProjectorInput, ActionSpeed, PictureMode, ColorTemperature, GenericCommandInterface, Geometry, Aspect, CustomMasking, EdgeBlending, ColorMatching, RgbValue } from '../Types'

test('POWER specification', () => {
    const cmd = Command.PowerCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QPW')

    // Set
    expect(cmd.getSetCommand(true)).toBe('PON')
    expect(cmd.getSetCommand(false)).toBe('POF')

    // Parse
    expect(cmd.parseResponse('000')).toBe(false)
    expect(cmd.parseResponse('001')).toBe(true)
    expect(cmd.parseResponse('')).toBe(undefined)
})

test('INPUT SELECT specification', () => {
    const cmd = Command.InputSelectCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QIN')

    // Set
    expect(cmd.getSetCommand(ProjectorInput.COMPUTER1)).toBe('IIS:RG1')
    expect(cmd.getSetCommand(ProjectorInput.COMPUTER2)).toBe('IIS:RG2')
    expect(cmd.getSetCommand(ProjectorInput.VIDEO)).toBe('IIS:VID')
    expect(cmd.getSetCommand(ProjectorInput['Y/C'])).toBe('IIS:SVD')
    expect(cmd.getSetCommand(ProjectorInput.DVI)).toBe('IIS:DVI')
    expect(cmd.getSetCommand(ProjectorInput.HDMI1)).toBe('IIS:HD1')
    expect(cmd.getSetCommand(ProjectorInput.SDI1)).toBe('IIS:SD1')
    expect(cmd.getSetCommand(ProjectorInput.SDI2)).toBe('IIS:SD2')
    expect(cmd.getSetCommand(ProjectorInput['DIGITAL LINK'])).toBe('IIS:DL1')

    // Parse
    expect(cmd.parseResponse('RG1')).toBe(ProjectorInput.COMPUTER1)
    expect(cmd.parseResponse('RG2')).toBe(ProjectorInput.COMPUTER2)
    expect(cmd.parseResponse('VID')).toBe(ProjectorInput.VIDEO)
    expect(cmd.parseResponse('SVD')).toBe(ProjectorInput['Y/C'])
    expect(cmd.parseResponse('DVI')).toBe(ProjectorInput.DVI)
    expect(cmd.parseResponse('HD1')).toBe(ProjectorInput.HDMI1)
    expect(cmd.parseResponse('SD1')).toBe(ProjectorInput.SDI1)
    expect(cmd.parseResponse('SD2')).toBe(ProjectorInput.SDI2)
    expect(cmd.parseResponse('DL1')).toBe(ProjectorInput['DIGITAL LINK'])
})

test('FREEZE specification', () => {
    const cmd = Command.FreezeCommand
    // Query
    expect(cmd.getQueryCommand()).toBe('QFZ')

    // Set
    expect(cmd.getSetCommand(true)).toBe('OFZ:1')
    expect(cmd.getSetCommand(false)).toBe('OFZ:0')

    // Parse
    expect(cmd.parseResponse('0')).toBe(false)
    expect(cmd.parseResponse('1')).toBe(true)
})

test('SHUTTER specification', () => {
    const cmd = Command.ShutterCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QSH')

    // Set
    expect(cmd.getSetCommand(true)).toBe('OSH:1')
    expect(cmd.getSetCommand(false)).toBe('OSH:0')

    expect(cmd.getSetCommand(undefined)).toBe('OSH')

    // Parse
    expect(cmd.parseResponse('0')).toBe(false)
    expect(cmd.parseResponse('1')).toBe(true)
})

function testActionSpeeds (cmd: GenericCommandInterface<ActionSpeed>, variable: string): void {
    // Set
    expect(cmd.getSetCommand(ActionSpeed['SLOW+'])).toBe('VXX:' + variable + '=+00000')
    expect(cmd.getSetCommand(ActionSpeed['SLOW-'])).toBe('VXX:' + variable + '=+00001')
    expect(cmd.getSetCommand(ActionSpeed['NORMAL+'])).toBe('VXX:' + variable + '=+00100')
    expect(cmd.getSetCommand(ActionSpeed['NORMAL-'])).toBe('VXX:' + variable + '=+00101')
    expect(cmd.getSetCommand(ActionSpeed['FAST+'])).toBe('VXX:' + variable + '=+00200')
    expect(cmd.getSetCommand(ActionSpeed['FAST-'])).toBe('VXX:' + variable + '=+00201')

    // Parse
    expect(cmd.parseResponse(variable + '=+00000')).toBe(ActionSpeed['SLOW+'])
    expect(cmd.parseResponse(variable + '=+00001')).toBe(ActionSpeed['SLOW-'])
    expect(cmd.parseResponse(variable + '=+00100')).toBe(ActionSpeed['NORMAL+'])
    expect(cmd.parseResponse(variable + '=+00101')).toBe(ActionSpeed['NORMAL-'])
    expect(cmd.parseResponse(variable + '=+00200')).toBe(ActionSpeed['FAST+'])
    expect(cmd.parseResponse(variable + '=+00201')).toBe(ActionSpeed['FAST-'])
}

test('LENS-SHIFT HORIZONTAL specification', () => {
    testActionSpeeds(Command.LensShiftHorizontalCommand, 'LNSI2')
})

test('LENS-SHIFT VERTIVAL specification', () => {
    testActionSpeeds(Command.LensShiftVerticalCommand, 'LNSI3')
})

test('LENS FOCUS specification', () => {
    testActionSpeeds(Command.LensFocusCommand, 'LNSI4')
})

test('LENS ZOOM specification', () => {
    testActionSpeeds(Command.LensZoomCommand, 'LNSI5')
})

test('LENS POSITION HORIZONTAL specification', () => {
    const cmd = Command.LensPositionHorizontalCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:LNSI7')

    // Set
    expect(cmd.getSetCommand(-2480)).toBe('VXX:LNSI7=-02480')
    expect(cmd.getSetCommand(2480)).toBe('VXX:LNSI7=+02480')
    expect(cmd.getSetCommand(-100)).toBe('VXX:LNSI7=-00100')
    expect(cmd.getSetCommand(0)).toBe('VXX:LNSI7=+00000')
    expect(cmd.getSetCommand(undefined)).toBe('VXX:LNSI7')

    // Parse
    expect(cmd.parseResponse('LNSI7=-02480')).toBe(-2480)
    expect(cmd.parseResponse('LNSI7=+02480')).toBe(2480)
    expect(cmd.parseResponse('LNSI7=+00000')).toBe(0)
    expect(cmd.parseResponse('')).toBe(undefined)
})

test('LENS POSITION VERTICAL specification', () => {
    const cmd = Command.LensPositionVerticalCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:LNSI8')

    // Set
    expect(cmd.getSetCommand(-3200)).toBe('VXX:LNSI8=-03200')
    expect(cmd.getSetCommand(3200)).toBe('VXX:LNSI8=+03200')
    expect(cmd.getSetCommand(-100)).toBe('VXX:LNSI8=-00100')
    expect(cmd.getSetCommand(0)).toBe('VXX:LNSI8=+00000')

    // Parse
    expect(cmd.parseResponse('LNSI8=-03200')).toBe(-3200)
    expect(cmd.parseResponse('LNSI8=+03200')).toBe(3200)
    expect(cmd.parseResponse('LNSI8=+00000')).toBe(0)
})

test('LENS POSITION FOCUS specification', () => {
    const cmd = Command.LensPositionFocusCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:LNSI9')

    // Set
    expect(cmd.getSetCommand(0)).toBe('VXX:LNSI9=+00000')
    expect(cmd.getSetCommand(20)).toBe('VXX:LNSI9=+00020')
    expect(cmd.getSetCommand(2560)).toBe('VXX:LNSI9=+02560')

    // Parse
    expect(cmd.parseResponse('LNSI9=+00000')).toBe(0)
    expect(cmd.parseResponse('LNSI9=+00020')).toBe(20)
    expect(cmd.parseResponse('LNSI9=+02560')).toBe(2560)
})

test('PICTURE MODE specification', () => {
    const cmd = Command.PictureModeCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QPM')

    // Set
    expect(cmd.getSetCommand(PictureMode.DYNAMIC)).toBe('VPM:DYN')
    expect(cmd.getSetCommand(PictureMode.NATURAL)).toBe('VPM:NAT')
    expect(cmd.getSetCommand(PictureMode.STANDARD)).toBe('VPM:STD')
    expect(cmd.getSetCommand(PictureMode.CINEMA)).toBe('VPM:CIN')
    expect(cmd.getSetCommand(PictureMode.GRAPHIC)).toBe('VPM:GRA')
    expect(cmd.getSetCommand(PictureMode['DICOM SIM'])).toBe('VPM:DIC')
    expect(cmd.getSetCommand(PictureMode.USER)).toBe('VPM:USR')

    // Parse
    expect(cmd.parseResponse('DYN')).toBe(PictureMode.DYNAMIC)
    expect(cmd.parseResponse('NAT')).toBe(PictureMode.NATURAL)
    expect(cmd.parseResponse('STD')).toBe(PictureMode.STANDARD)
    expect(cmd.parseResponse('CIN')).toBe(PictureMode.CINEMA)
    expect(cmd.parseResponse('GRA')).toBe(PictureMode.GRAPHIC)
    expect(cmd.parseResponse('DIC')).toBe(PictureMode['DICOM SIM'])
    expect(cmd.parseResponse('USR')).toBe(PictureMode.USER)
})

test('CONTRAST specification', () => {
    const cmd = Command.ContrastCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVR')

    // Set
    expect(cmd.getSetCommand(-31)).toBe('VCN:001')
    expect(cmd.getSetCommand(0)).toBe('VCN:032')
    expect(cmd.getSetCommand(31)).toBe('VCN:063')

    // Parse
    expect(cmd.parseResponse('001')).toBe(-31)
    expect(cmd.parseResponse('032')).toBe(0)
    expect(cmd.parseResponse('063')).toBe(31)
})

test('BRIGHTNESS specification', () => {
    const cmd = Command.BrightnessCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVB')

    // Set
    expect(cmd.getSetCommand(-31)).toBe('VBR:001')
    expect(cmd.getSetCommand(0)).toBe('VBR:032')
    expect(cmd.getSetCommand(31)).toBe('VBR:063')

    // Parse
    expect(cmd.parseResponse('001')).toBe(-31)
    expect(cmd.parseResponse('032')).toBe(0)
    expect(cmd.parseResponse('063')).toBe(31)
})

test('COLOR specification', () => {
    const cmd = Command.ColorCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVC')

    // Set
    expect(cmd.getSetCommand(-31)).toBe('VCO:001')
    expect(cmd.getSetCommand(0)).toBe('VCO:032')
    expect(cmd.getSetCommand(31)).toBe('VCO:063')

    // Parse
    expect(cmd.parseResponse('001')).toBe(-31)
    expect(cmd.parseResponse('032')).toBe(0)
    expect(cmd.parseResponse('063')).toBe(31)
})

test('TINT specification', () => {
    const cmd = Command.TintCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVT')

    // Set
    expect(cmd.getSetCommand(-31)).toBe('VTN:001')
    expect(cmd.getSetCommand(0)).toBe('VTN:032')
    expect(cmd.getSetCommand(31)).toBe('VTN:063')

    // Parse
    expect(cmd.parseResponse('001')).toBe(-31)
    expect(cmd.parseResponse('032')).toBe(0)
    expect(cmd.parseResponse('063')).toBe(31)
})

test('SHARPNESS specification', () => {
    const cmd = Command.SharpnessCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVS')

    // Set
    expect(cmd.getSetCommand(0)).toBe('VSR:000')
    expect(cmd.getSetCommand(5)).toBe('VSR:005')
    expect(cmd.getSetCommand(15)).toBe('VSR:015')

    // Parse
    expect(cmd.parseResponse('000')).toBe(0)
    expect(cmd.parseResponse('005')).toBe(5)
    expect(cmd.parseResponse('015')).toBe(15)
})

test('COLOR TEMPERATURE specification', () => {
    const cmd = Command.ColorTemperatureCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QTE')

    // Set
    expect(cmd.getSetCommand(ColorTemperature.DEFAULT)).toBe('OTE:1')
    expect(cmd.getSetCommand(ColorTemperature.USER1)).toBe('OTE:04')
    expect(cmd.getSetCommand(ColorTemperature.USER2)).toBe('OTE:09')
    expect(cmd.getSetCommand(ColorTemperature['3200K'])).toBe('OTE:3200')
    expect(cmd.getSetCommand(ColorTemperature['3300K'])).toBe('OTE:3300')
    expect(cmd.getSetCommand(ColorTemperature['9200K'])).toBe('OTE:9200')
    expect(cmd.getSetCommand(ColorTemperature['9300K'])).toBe('OTE:9300')

    // Parse
    expect(cmd.parseResponse('1')).toBe(ColorTemperature.DEFAULT)
    expect(cmd.parseResponse('04')).toBe(ColorTemperature.USER1)
    expect(cmd.parseResponse('09')).toBe(ColorTemperature.USER2)
    expect(cmd.parseResponse('3200')).toBe(ColorTemperature['3200K'])
    expect(cmd.parseResponse('3300')).toBe(ColorTemperature['3300K'])
    expect(cmd.parseResponse('9200')).toBe(ColorTemperature['9200K'])
    expect(cmd.parseResponse('9300')).toBe(ColorTemperature['9300K'])
})

test('WHITE BALANCE LOW RED specification', () => {
    const cmd = Command.WhiteBalanceLowRedCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QOR')

    // Set
    expect(cmd.getSetCommand(-127)).toBe('VOR:001')
    expect(cmd.getSetCommand(0)).toBe('VOR:128')
    expect(cmd.getSetCommand(+127)).toBe('VOR:255')

    // Parse
    expect(cmd.parseResponse('001')).toBe(-127)
    expect(cmd.parseResponse('128')).toBe(0)
    expect(cmd.parseResponse('255')).toBe(127)
})

test('WHITE BALANCE LOW Greem specification', () => {
    const cmd = Command.WhiteBalanceLowGreenCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QOG')

    // Set
    expect(cmd.getSetCommand(-127)).toBe('VOG:001')
    expect(cmd.getSetCommand(0)).toBe('VOG:128')
    expect(cmd.getSetCommand(+127)).toBe('VOG:255')

    // Parse
    expect(cmd.parseResponse('001')).toBe(-127)
    expect(cmd.parseResponse('128')).toBe(0)
    expect(cmd.parseResponse('255')).toBe(127)
})

test('WHITE BALANCE LOW BLUE specification', () => {
    const cmd = Command.WhiteBalanceLowBlueCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QOB')

    // Set
    expect(cmd.getSetCommand(-127)).toBe('VOB:001')
    expect(cmd.getSetCommand(0)).toBe('VOB:128')
    expect(cmd.getSetCommand(+127)).toBe('VOB:255')

    // Parse
    expect(cmd.parseResponse('001')).toBe(-127)
    expect(cmd.parseResponse('128')).toBe(0)
    expect(cmd.parseResponse('255')).toBe(127)
})

test('WHITE BALANCE HIGH RED specification', () => {
    const cmd = Command.WhiteBalanceHighRedCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QHR')

    // Set
    expect(cmd.getSetCommand(0)).toBe('VHR:000')
    expect(cmd.getSetCommand(100)).toBe('VHR:100')
    expect(cmd.getSetCommand(255)).toBe('VHR:255')

    // Parse
    expect(cmd.parseResponse('000')).toBe(0)
    expect(cmd.parseResponse('001')).toBe(1)
    expect(cmd.parseResponse('255')).toBe(255)
})

test('WHITE BALANCE HIGH GREEN specification', () => {
    const cmd = Command.WhiteBalanceHighGreenCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QHG')

    // Set
    expect(cmd.getSetCommand(0)).toBe('VHG:000')
    expect(cmd.getSetCommand(100)).toBe('VHG:100')
    expect(cmd.getSetCommand(255)).toBe('VHG:255')

    // Parse
    expect(cmd.parseResponse('000')).toBe(0)
    expect(cmd.parseResponse('001')).toBe(1)
    expect(cmd.parseResponse('255')).toBe(255)
})

test('WHITE BALANCE HIGH BLUE specification', () => {
    const cmd = Command.WhiteBalanceHighBlueCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QHB')

    // Set
    expect(cmd.getSetCommand(0)).toBe('VHB:000')
    expect(cmd.getSetCommand(100)).toBe('VHB:100')
    expect(cmd.getSetCommand(255)).toBe('VHB:255')

    // Parse
    expect(cmd.parseResponse('000')).toBe(0)
    expect(cmd.parseResponse('001')).toBe(1)
    expect(cmd.parseResponse('255')).toBe(255)
})

test('GEOMETRY specification', () => {
    const cmd = Command.GeometryCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:GMMI0')

    // Set
    expect(cmd.getSetCommand(Geometry.OFF)).toBe('VXX:GMMI0=+00000')
    expect(cmd.getSetCommand(Geometry.KEYSTONE)).toBe('VXX:GMMI0=+00001')
    expect(cmd.getSetCommand(Geometry.CURVED)).toBe('VXX:GMMI0=+00002')
    expect(cmd.getSetCommand(Geometry['PC-1'])).toBe('VXX:GMMI0=+00003')
    expect(cmd.getSetCommand(Geometry['PC-2'])).toBe('VXX:GMMI0=+00004')
    expect(cmd.getSetCommand(Geometry['PC-3'])).toBe('VXX:GMMI0=+00005')
    expect(cmd.getSetCommand(Geometry['CORNER-CORRECTION'])).toBe('VXX:GMMI0=+00010')

    // Parse
    expect(cmd.parseResponse('GMMI0=+00000')).toBe(Geometry.OFF)
    expect(cmd.parseResponse('GMMI0=+00001')).toBe(Geometry.KEYSTONE)
    expect(cmd.parseResponse('GMMI0=+00002')).toBe(Geometry.CURVED)
    expect(cmd.parseResponse('GMMI0=+00003')).toBe(Geometry['PC-1'])
    expect(cmd.parseResponse('GMMI0=+00004')).toBe(Geometry['PC-2'])
    expect(cmd.parseResponse('GMMI0=+00005')).toBe(Geometry['PC-3'])
    expect(cmd.parseResponse('GMMI0=+00010')).toBe(Geometry['CORNER-CORRECTION'])
})

test('SHIFT-HORIZONATL specification', () => {
    const cmd = Command.ShiftHorizontalCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QTH')

    // Set
    expect(cmd.getSetCommand(0)).toBe('VTH:0000')
    expect(cmd.getSetCommand(100)).toBe('VTH:0100')
    expect(cmd.getSetCommand(4095)).toBe('VTH:4095')

    // Parse
    expect(cmd.parseResponse('0000')).toBe(0)
    expect(cmd.parseResponse('0100')).toBe(100)
    expect(cmd.parseResponse('4095')).toBe(4095)
})

test('SHIFT-VERTICAL specification', () => {
    const cmd = Command.ShiftVerticalCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QTV')

    // Set
    expect(cmd.getSetCommand(0)).toBe('VTV:0000')
    expect(cmd.getSetCommand(100)).toBe('VTV:0100')
    expect(cmd.getSetCommand(4094)).toBe('VTV:4094')

    // Parse
    expect(cmd.parseResponse('0000')).toBe(0)
    expect(cmd.parseResponse('0100')).toBe(100)
    expect(cmd.parseResponse('4094')).toBe(4094)
})

test('CLOCK PHASE specification', () => {
    const cmd = Command.ClockPhaseCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QCP')

    // Set
    expect(cmd.getSetCommand(0)).toBe('VCP:000')
    expect(cmd.getSetCommand(10)).toBe('VCP:010')
    expect(cmd.getSetCommand(31)).toBe('VCP:031')

    // Parse
    expect(cmd.parseResponse('000')).toBe(0)
    expect(cmd.parseResponse('010')).toBe(10)
    expect(cmd.parseResponse('031')).toBe(31)
})

test('ASPECT specification', () => {
    const cmd = Command.AspectCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QSE')

    // Set
    expect(cmd.getSetCommand(Aspect['AUTO/VID AUTO/DEFAULT'])).toBe('VSE:0')
    expect(cmd.getSetCommand(Aspect['NORMAL(4:3)'])).toBe('VSE:1')
    expect(cmd.getSetCommand(Aspect['WIDE(16:9)'])).toBe('VSE:2')
    expect(cmd.getSetCommand(Aspect['NATIVE(through)'])).toBe('VSE:5')
    expect(cmd.getSetCommand(Aspect['FULL(HV FIT)'])).toBe('VSE:6')
    expect(cmd.getSetCommand(Aspect['H-FIT'])).toBe('VSE:9')
    expect(cmd.getSetCommand(Aspect['V-FIT'])).toBe('VSE:10')

    // Parse
    expect(cmd.parseResponse('0')).toBe(Aspect['AUTO/VID AUTO/DEFAULT'])
    expect(cmd.parseResponse('1')).toBe(Aspect['NORMAL(4:3)'])
    expect(cmd.parseResponse('2')).toBe(Aspect['WIDE(16:9)'])
    expect(cmd.parseResponse('5')).toBe(Aspect['NATIVE(through)'])
    expect(cmd.parseResponse('6')).toBe(Aspect['FULL(HV FIT)'])
    expect(cmd.parseResponse('9')).toBe(Aspect['H-FIT'])
    expect(cmd.parseResponse('10')).toBe(Aspect['V-FIT'])
})

function testZoomCommand (cmd: GenericCommandInterface<number>, name: string) {
    // Query
    expect(cmd.getQueryCommand()).toBe('Q' + name)

    // Set
    expect(cmd.getSetCommand(50)).toBe('O' + name + ':050')
    expect(cmd.getSetCommand(100)).toBe('O' + name + ':100')
    expect(cmd.getSetCommand(999)).toBe('O' + name + ':999')

    // Parse
    expect(cmd.parseResponse('050')).toBe(50)
    expect(cmd.parseResponse('100')).toBe(100)
    expect(cmd.parseResponse('999')).toBe(999)
}

test('ZOOM-HORIZONTAL specification', () => {
    testZoomCommand(Command.ZoomHorizontalCommand, 'ZH')
})

test('ZOOM-VERTICAL specification', () => {
    testZoomCommand(Command.ZoomVerticalCommand, 'ZV')
})

test('ZOOM-BOTH specification', () => {
    testZoomCommand(Command.ZoomBothCommand, 'ZO')
})

test('ZOOM-INTERLOCKED specification', () => {
    // Query
    expect(Command.ZoomInterlockedCommand.getQueryCommand()).toBe('QZS')

    // Set
    expect(Command.ZoomInterlockedCommand.getSetCommand(true)).toBe('OZS:1')
    expect(Command.ZoomInterlockedCommand.getSetCommand(false)).toBe('OZS:0')

    // Parse
    expect(Command.ZoomInterlockedCommand.parseResponse('0')).toBe(false)
    expect(Command.ZoomInterlockedCommand.parseResponse('1')).toBe(true)
})

test('ZOOM-MODE specification', () => {
    // Query
    expect(Command.ZoomModeFullCommand.getQueryCommand()).toBe('QZT')

    // Set
    expect(Command.ZoomModeFullCommand.getSetCommand(true)).toBe('OZT:1')
    expect(Command.ZoomModeFullCommand.getSetCommand(false)).toBe('OZT:0')

    // Parse
    expect(Command.ZoomModeFullCommand.parseResponse('0')).toBe(false)
    expect(Command.ZoomModeFullCommand.parseResponse('1')).toBe(true)
})

test('BLANKING-UPPER specification', () => {
    const cmd = Command.BlankingUpperCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QLU')

    // Set
    expect(cmd.getSetCommand(0)).toBe('DBU:000')
    expect(cmd.getSetCommand(999)).toBe('DBU:999')
    expect(cmd.getSetCommand(1234)).toBe('DBU:1234')

    // Parse
    expect(cmd.parseResponse('000')).toBe(0)
    expect(cmd.parseResponse('999')).toBe(999)
    expect(cmd.parseResponse('1234')).toBe(1234)
})

test('BLANKING-LOWER specification', () => {
    const cmd = Command.BlankingLowerCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QLB')

    // Set
    expect(cmd.getSetCommand(0)).toBe('DBB:000')
    expect(cmd.getSetCommand(999)).toBe('DBB:999')
    expect(cmd.getSetCommand(1234)).toBe('DBB:1234')

    // Parse
    expect(cmd.parseResponse('000')).toBe(0)
    expect(cmd.parseResponse('999')).toBe(999)
    expect(cmd.parseResponse('1234')).toBe(1234)
})

test('BLANKING-RIGHT specification', () => {
    const cmd = Command.BlankingRightCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QLR')

    // Set
    expect(cmd.getSetCommand(0)).toBe('DBR:000')
    expect(cmd.getSetCommand(999)).toBe('DBR:999')
    expect(cmd.getSetCommand(1234)).toBe('DBR:1234')

    // Parse
    expect(cmd.parseResponse('000')).toBe(0)
    expect(cmd.parseResponse('999')).toBe(999)
    expect(cmd.parseResponse('1234')).toBe(1234)
})

test('BLANKING-LEFT specification', () => {
    const cmd = Command.BlankingLeftCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QLL')

    // Set
    expect(cmd.getSetCommand(0)).toBe('DBL:000')
    expect(cmd.getSetCommand(999)).toBe('DBL:999')
    expect(cmd.getSetCommand(1234)).toBe('DBL:1234')

    // Parse
    expect(cmd.parseResponse('000')).toBe(0)
    expect(cmd.parseResponse('999')).toBe(999)
    expect(cmd.parseResponse('1234')).toBe(1234)
})

test('CUSTOM MASKING specification', () => {
    const cmd = Command.CustomMaskingCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:MSKI1')

    // Set
    expect(cmd.getSetCommand(CustomMasking.OFF)).toBe('VXX:MSKI1=+00000')
    expect(cmd.getSetCommand(CustomMasking['PC-1'])).toBe('VXX:MSKI1=+00001')
    expect(cmd.getSetCommand(CustomMasking['PC-2'])).toBe('VXX:MSKI1=+00002')
    expect(cmd.getSetCommand(CustomMasking['PC-3'])).toBe('VXX:MSKI1=+00003')

    // Parse
    expect(cmd.parseResponse('MSKI1=+00000')).toBe(CustomMasking.OFF)
    expect(cmd.parseResponse('MSKI1=+00001')).toBe(CustomMasking['PC-1'])
    expect(cmd.parseResponse('MSKI1=+00002')).toBe(CustomMasking['PC-2'])
    expect(cmd.parseResponse('MSKI1=+00003')).toBe(CustomMasking['PC-3'])
})

test('EDGE BLENDING specification', () => {
    const cmd = Command.EdgeBlendingCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:EDBI0')

    // Set
    expect(cmd.getSetCommand(EdgeBlending.OFF)).toBe('VXX:EDBI0=+00000')
    expect(cmd.getSetCommand(EdgeBlending.ON)).toBe('VXX:EDBI0=+00001')
    expect(cmd.getSetCommand(EdgeBlending.USER)).toBe('VXX:EDBI0=+00002')

    // Parse
    expect(cmd.parseResponse('EDBI0=+00000')).toBe(EdgeBlending.OFF)
    expect(cmd.parseResponse('EDBI0=+00001')).toBe(EdgeBlending.ON)
    expect(cmd.parseResponse('EDBI0=+00002')).toBe(EdgeBlending.USER)
})

test('COLOR MATCHING specification', () => {
    const cmd = Command.ColorMatchingCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:CMAI0')

    // Set
    expect(cmd.getSetCommand(ColorMatching.OFF)).toBe('VXX:CMAI0=+00000')
    expect(cmd.getSetCommand(ColorMatching['3COLORS'])).toBe('VXX:CMAI0=+00001')
    expect(cmd.getSetCommand(ColorMatching['7COLORS'])).toBe('VXX:CMAI0=+00002')
    expect(cmd.getSetCommand(ColorMatching.MEASURED)).toBe('VXX:CMAI0=+00004')

    expect(cmd.getSetCommand(undefined)).toBe('VXX:CMAI0')

    // Parse
    expect(cmd.parseResponse('CMAI0=+00000')).toBe(ColorMatching.OFF)
    expect(cmd.parseResponse('CMAI0=+00001')).toBe(ColorMatching['3COLORS'])
    expect(cmd.parseResponse('CMAI0=+00002')).toBe(ColorMatching['7COLORS'])
    expect(cmd.parseResponse('CMAI0=+00004')).toBe(ColorMatching.MEASURED)
})

function testRgbCommand (cmd: GenericCommandInterface<RgbValue>, setPrefix: string, valuePrefix: string) {

    // Set
    expect(cmd.getSetCommand({ R:    0, G:    0, B:    0 })).toBe(setPrefix + '0000,0000,0000')
    expect(cmd.getSetCommand({ R: 2048, G: 2048, B: 2048 })).toBe(setPrefix + '2048,2048,2048')
    expect(cmd.getSetCommand({ R:  100, G:    0, B:    0 })).toBe(setPrefix + '0100,0000,0000')
    expect(cmd.getSetCommand({ R:    0, G:  100, B:    0 })).toBe(setPrefix + '0000,0100,0000')
    expect(cmd.getSetCommand({ R:    0, G:    0, B:  100 })).toBe(setPrefix + '0000,0000,0100')

    expect(cmd.getSetCommand(undefined)).toBe(setPrefix.substring(0, setPrefix.length - 1) + '')

    // Parse
    expect(cmd.parseResponse(valuePrefix + '0000,0000,0000')).toStrictEqual({ R:    0, G:    0, B:    0 })
    expect(cmd.parseResponse(valuePrefix + '2048,2048,2048')).toStrictEqual({ R: 2048, G: 2048, B: 2048 })
    expect(cmd.parseResponse(valuePrefix + '0100,0000,0000')).toStrictEqual({ R:  100, G:    0, B:    0 })
    expect(cmd.parseResponse(valuePrefix + '0000,0100,0000')).toStrictEqual({ R:    0, G:  100, B:    0 })
    expect(cmd.parseResponse(valuePrefix + '0000,0000,0100')).toStrictEqual({ R:    0, G:    0, B:  100 })

    expect(cmd.parseResponse(valuePrefix + '0000')).toBe(undefined)
}

test('COLOR MATCHING-3COLORS-RED specification', () => {
    const cmd = Command.ColorMatching3ColorsRedCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QMR')

    // Set + Parse
    testRgbCommand(cmd, 'VMR:', '')
})

test('COLOR MATCHING-3COLORS-GREEN specification', () => {
    const cmd = Command.ColorMatching3ColorsGreenCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QMG')

    // Set + Parse
    testRgbCommand(cmd, 'VMG:', '')
})

test('COLOR MATCHING-3COLORS-BLUE specification', () => {
    const cmd = Command.ColorMatching3ColorsBlueCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QMB')

    // Set + Parse
    testRgbCommand(cmd, 'VMB:', '')
})

test('COLOR MATCHING-3COLORS-WHITE specification', () => {
    const cmd = Command.ColorMatching3ColorsWhiteCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QMW')

    // Set
    expect(cmd.getSetCommand(256)).toBe('VMW:0256')
    expect(cmd.getSetCommand(999)).toBe('VMW:0999')
    expect(cmd.getSetCommand(2048)).toBe('VMW:2048')

    // Parse
    expect(cmd.parseResponse('0256')).toBe(256)
    expect(cmd.parseResponse('0999')).toBe(999)
    expect(cmd.parseResponse('2048')).toBe(2048)
})

test('COLOR MATCHING-3COLORS-AUTO TESTPATTERN specification', () => {
    const cmd = Command.ColorMatching3ColorsAutoTestpatternCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:CATI0')

    // Set
    expect(cmd.getSetCommand(true)).toBe('VXX:CATI0=+00001')
    expect(cmd.getSetCommand(false)).toBe('VXX:CATI0=+00000')

    // Parse
    expect(cmd.parseResponse('CATI0=+00000')).toBe(false)
    expect(cmd.parseResponse('CATI0=+00001')).toBe(true)
})

test('COLOR MATCHING-7COLORS-RED specification', () => {
    const cmd = Command.ColorMatching7ColorsRedCommand
    const attr = 'C7CS0'

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:' + attr)

    // Set + Parse
    testRgbCommand(cmd, 'VXX:' + attr + '=', attr + '=')
})

test('COLOR MATCHING-7COLORS-GREEN specification', () => {
    const cmd = Command.ColorMatching7ColorsGreenCommand
    const attr = 'C7CS1'

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:' + attr)

    // Set + Parse
    testRgbCommand(cmd, 'VXX:' + attr + '=', attr + '=')
})

test('COLOR MATCHING-7COLORS-BLUE specification', () => {
    const cmd = Command.ColorMatching7ColorsBlueCommand
    const attr = 'C7CS2'

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:' + attr)

    // Set + Parse
    testRgbCommand(cmd, 'VXX:' + attr + '=', attr + '=')
})

test('COLOR MATCHING-7COLORS-CYAN specification', () => {
    const cmd = Command.ColorMatching7ColorsCyanCommand
    const attr = 'C7CS3'

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:' + attr)

    // Set + Parse
    testRgbCommand(cmd, 'VXX:' + attr + '=', attr + '=')
})

test('COLOR MATCHING-7COLORS-MAGENTA specification', () => {
    const cmd = Command.ColorMatching7ColorsMagentaCommand
    const attr = 'C7CS4'

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:' + attr)

    // Set + Parse
    testRgbCommand(cmd, 'VXX:' + attr + '=', attr + '=')
})

test('COLOR MATCHING-7COLORS-YELLOW specification', () => {
    const cmd = Command.ColorMatching7ColorsYellowCommand
    const attr = 'C7CS5'

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:' + attr)

    // Set + Parse
    testRgbCommand(cmd, 'VXX:' + attr + '=', attr + '=')
})

test('COLOR MATCHING-7COLORS-WHITE specification', () => {
    const cmd = Command.ColorMatching7ColorsWhiteCommand
    const attr = 'C7CS6'

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:' + attr)

    // Set + Parse
    testRgbCommand(cmd, 'VXX:' + attr + '=', attr + '=')
})

test('COLOR MATCHING-7COLORS-AUTO TESTPATTERN specification', () => {
    const cmd = Command.ColorMatching7ColorsAutoTestpatternCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:CATI1')

    // Set
    expect(cmd.getSetCommand(true)).toBe('VXX:CATI1=+00001')
    expect(cmd.getSetCommand(false)).toBe('VXX:CATI1=+00000')

    // Parse
    expect(cmd.parseResponse('CATI1=+00000')).toBe(false)
    expect(cmd.parseResponse('CATI1=+00001')).toBe(true)
})
