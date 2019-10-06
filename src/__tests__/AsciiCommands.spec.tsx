import * as Command from '../Commands'
import { ProjectorInput, ActionSpeed, PictureMode, ColorTemperature, GenericCommandInterface, Geometry, Aspect, CustomMasking, EdgeBlending, ColorMatching, RgbValue, ScreenSetting, ShutterFade, NoSignalShutOff, LensMemory, LampControlStatus, LampStatus, TestPattern } from '../Types'

test('MODEL NAME specification', () => {
    const cmd = Command.ModelNameCommand

    // Label
    expect(cmd.label).toBe('ModelName')

    // Query
    expect(cmd.getQueryCommand()).toBe('QID')

    // Set -> no setter specified

    // Parse
    expect(cmd.parseResponse('DW830E')).toBe('DW830E')
})

test('PROJCETOR NAME SETTING specification', () => {
    const cmd = Command.ProjectorNameCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:NCGS8')

    // Set
    expect(cmd.getSetCommand('PROJECTOR1')).toBe('VXX:NCGS8=PROJECTOR1')
    expect(cmd.getSetCommand('NAME0857')).toBe('VXX:NCGS8=NAME0857')

    // Parse
    expect(cmd.parseResponse('PROJECTOR1')).toBe('PROJECTOR1')
    expect(cmd.parseResponse('NAME0857')).toBe('NAME0857')
    expect(cmd.parseResponse('')).toBe('')
})

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

test('EDGE BLENDING-MARKER-ON/OFF specification', () => {
    const cmd = Command.EdgeBlendingMarkerCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QGM')

    // Set
    expect(cmd.getSetCommand(false)).toBe('VGM:0')
    expect(cmd.getSetCommand(true)).toBe('VGM:1')

    // Parse
    expect(cmd.parseResponse('0')).toBe(false)
    expect(cmd.parseResponse('1')).toBe(true)
})

test('INPUT GUIDE specification', () => {
    const cmd = Command.InputGuideCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QDI')

    // Set
    expect(cmd.getSetCommand(false)).toBe('OID:0')
    expect(cmd.getSetCommand(true)).toBe('OID:1')

    // Parse
    expect(cmd.parseResponse('0')).toBe(false)
    expect(cmd.parseResponse('1')).toBe(true)
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

test('ON SCREEN specification', () => {
    const cmd = Command.OnScreenCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QOS')

    // Set
    expect(cmd.getSetCommand(true)).toBe('OOS:1')
    expect(cmd.getSetCommand(false)).toBe('OOS:0')

    // Parse
    expect(cmd.parseResponse('0')).toBe(false)
    expect(cmd.parseResponse('1')).toBe(true)
})

test('SCREEN SETTING specification', () => {
    const cmd = Command.ScreenSettingCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QSF')

    // Set
    expect(cmd.getSetCommand(ScreenSetting['16:10'])).toBe('VSF:0')
    expect(cmd.getSetCommand(ScreenSetting['16:9'])).toBe('VSF:1')
    expect(cmd.getSetCommand(ScreenSetting['4:3'])).toBe('VSF:2')

    // Parse
    expect(cmd.parseResponse('0')).toBe(ScreenSetting['16:10'])
    expect(cmd.parseResponse('1')).toBe(ScreenSetting['16:9'])
    expect(cmd.parseResponse('2')).toBe(ScreenSetting['4:3'])
})

test('SHUTTER SETTING-FADE IN specification', () => {
    const cmd = Command.ShutterFadeInCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:SEFS1')

    // Set
    expect(cmd.getSetCommand(ShutterFade['0.0s(OFF)'])).toBe('VXX:SEFS1=0.0')
    expect(cmd.getSetCommand(ShutterFade['0.5s'])).toBe('VXX:SEFS1=0.5')
    expect(cmd.getSetCommand(ShutterFade['1.0s'])).toBe('VXX:SEFS1=1.0')
    expect(cmd.getSetCommand(ShutterFade['1.5s'])).toBe('VXX:SEFS1=1.5')
    expect(cmd.getSetCommand(ShutterFade['2.0s'])).toBe('VXX:SEFS1=2.0')
    expect(cmd.getSetCommand(ShutterFade['2.5s'])).toBe('VXX:SEFS1=2.5')
    expect(cmd.getSetCommand(ShutterFade['3.0s'])).toBe('VXX:SEFS1=3.0')
    expect(cmd.getSetCommand(ShutterFade['3.5s'])).toBe('VXX:SEFS1=3.5')
    expect(cmd.getSetCommand(ShutterFade['4.0s'])).toBe('VXX:SEFS1=4.0')
    expect(cmd.getSetCommand(ShutterFade['5.0s'])).toBe('VXX:SEFS1=5.0')
    expect(cmd.getSetCommand(ShutterFade['7.0s'])).toBe('VXX:SEFS1=7.0')
    expect(cmd.getSetCommand(ShutterFade['10.0s'])).toBe('VXX:SEFS1=10.0')

    // Parse
    expect(cmd.parseResponse('SEFS1=0.0')).toBe(ShutterFade['0.0s(OFF)'])
    expect(cmd.parseResponse('SEFS1=0.5')).toBe(ShutterFade['0.5s'])
    expect(cmd.parseResponse('SEFS1=1.0')).toBe(ShutterFade['1.0s'])
    expect(cmd.parseResponse('SEFS1=1.5')).toBe(ShutterFade['1.5s'])
    expect(cmd.parseResponse('SEFS1=2.0')).toBe(ShutterFade['2.0s'])
    expect(cmd.parseResponse('SEFS1=2.5')).toBe(ShutterFade['2.5s'])
    expect(cmd.parseResponse('SEFS1=3.0')).toBe(ShutterFade['3.0s'])
    expect(cmd.parseResponse('SEFS1=3.5')).toBe(ShutterFade['3.5s'])
    expect(cmd.parseResponse('SEFS1=4.0')).toBe(ShutterFade['4.0s'])
    expect(cmd.parseResponse('SEFS1=5.0')).toBe(ShutterFade['5.0s'])
    expect(cmd.parseResponse('SEFS1=7.0')).toBe(ShutterFade['7.0s'])
    expect(cmd.parseResponse('SEFS1=10.0')).toBe(ShutterFade['10.0s'])
})

test('SHUTTER SETTING-FADE OUT specification', () => {
    const cmd = Command.ShutterFadeOutCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:SEFS2')

    // Set
    expect(cmd.getSetCommand(ShutterFade['0.0s(OFF)'])).toBe('VXX:SEFS2=0.0')
    expect(cmd.getSetCommand(ShutterFade['0.5s'])).toBe('VXX:SEFS2=0.5')
    expect(cmd.getSetCommand(ShutterFade['1.0s'])).toBe('VXX:SEFS2=1.0')
    expect(cmd.getSetCommand(ShutterFade['1.5s'])).toBe('VXX:SEFS2=1.5')
    expect(cmd.getSetCommand(ShutterFade['2.0s'])).toBe('VXX:SEFS2=2.0')
    expect(cmd.getSetCommand(ShutterFade['2.5s'])).toBe('VXX:SEFS2=2.5')
    expect(cmd.getSetCommand(ShutterFade['3.0s'])).toBe('VXX:SEFS2=3.0')
    expect(cmd.getSetCommand(ShutterFade['3.5s'])).toBe('VXX:SEFS2=3.5')
    expect(cmd.getSetCommand(ShutterFade['4.0s'])).toBe('VXX:SEFS2=4.0')
    expect(cmd.getSetCommand(ShutterFade['5.0s'])).toBe('VXX:SEFS2=5.0')
    expect(cmd.getSetCommand(ShutterFade['7.0s'])).toBe('VXX:SEFS2=7.0')
    expect(cmd.getSetCommand(ShutterFade['10.0s'])).toBe('VXX:SEFS2=10.0')

    // Parse
    expect(cmd.parseResponse('SEFS2=0.0')).toBe(ShutterFade['0.0s(OFF)'])
    expect(cmd.parseResponse('SEFS2=0.5')).toBe(ShutterFade['0.5s'])
    expect(cmd.parseResponse('SEFS2=1.0')).toBe(ShutterFade['1.0s'])
    expect(cmd.parseResponse('SEFS2=1.5')).toBe(ShutterFade['1.5s'])
    expect(cmd.parseResponse('SEFS2=2.0')).toBe(ShutterFade['2.0s'])
    expect(cmd.parseResponse('SEFS2=2.5')).toBe(ShutterFade['2.5s'])
    expect(cmd.parseResponse('SEFS2=3.0')).toBe(ShutterFade['3.0s'])
    expect(cmd.parseResponse('SEFS2=3.5')).toBe(ShutterFade['3.5s'])
    expect(cmd.parseResponse('SEFS2=4.0')).toBe(ShutterFade['4.0s'])
    expect(cmd.parseResponse('SEFS2=5.0')).toBe(ShutterFade['5.0s'])
    expect(cmd.parseResponse('SEFS2=7.0')).toBe(ShutterFade['7.0s'])
    expect(cmd.parseResponse('SEFS2=10.0')).toBe(ShutterFade['10.0s'])
})

test('PROJECTOR ID specification', () => {
    const cmd = Command.ProjectorIdCommand

    // Query -> no query command

    // Set
    expect(cmd.getSetCommand(0)).toBe('RIS:00')
    expect(cmd.getSetCommand(20)).toBe('RIS:20')
    expect(cmd.getSetCommand(64)).toBe('RIS:64')

    // Parse -> no responses
})

test('ID ALL specification', () => {
    const cmd = Command.IdAllCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVY')

    // Set
    expect(cmd.getSetCommand(true)).toBe('RVS:1')
    expect(cmd.getSetCommand(false)).toBe('RVS:0')

    // Parse
    expect(cmd.parseResponse('0')).toBe(false)
    expect(cmd.parseResponse('1')).toBe(true)
})

test('NO SIGNAL SHUT-OFF specification', () => {
    const cmd = Command.NoSignalShutOffCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QAF')

    // Set
    expect(cmd.getSetCommand(NoSignalShutOff.DISABLE)).toBe('OAF:00')
    expect(cmd.getSetCommand(NoSignalShutOff['10min'])).toBe('OAF:10')
    expect(cmd.getSetCommand(NoSignalShutOff['20min'])).toBe('OAF:20')
    expect(cmd.getSetCommand(NoSignalShutOff['30min'])).toBe('OAF:30')
    expect(cmd.getSetCommand(NoSignalShutOff['40min'])).toBe('OAF:40')
    expect(cmd.getSetCommand(NoSignalShutOff['50min'])).toBe('OAF:50')
    expect(cmd.getSetCommand(NoSignalShutOff['60min'])).toBe('OAF:60')
    expect(cmd.getSetCommand(NoSignalShutOff['70min'])).toBe('OAF:70')
    expect(cmd.getSetCommand(NoSignalShutOff['80min'])).toBe('OAF:80')
    expect(cmd.getSetCommand(NoSignalShutOff['90min'])).toBe('OAF:90')

    // Parse
    expect(cmd.parseResponse('00')).toBe(NoSignalShutOff.DISABLE)
    expect(cmd.parseResponse('10')).toBe(NoSignalShutOff['10min'])
    expect(cmd.parseResponse('20')).toBe(NoSignalShutOff['20min'])
    expect(cmd.parseResponse('30')).toBe(NoSignalShutOff['30min'])
    expect(cmd.parseResponse('40')).toBe(NoSignalShutOff['40min'])
    expect(cmd.parseResponse('50')).toBe(NoSignalShutOff['50min'])
    expect(cmd.parseResponse('60')).toBe(NoSignalShutOff['60min'])
    expect(cmd.parseResponse('70')).toBe(NoSignalShutOff['70min'])
    expect(cmd.parseResponse('80')).toBe(NoSignalShutOff['80min'])
    expect(cmd.parseResponse('90')).toBe(NoSignalShutOff['90min'])
})

test('LENS MEMORY-LOAD specification', () => {
    const cmd = Command.LensMemoryLoadCommand

    // Query -> no query

    // Set
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY1'])).toBe('VXX:LNMI1=+00000')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY2'])).toBe('VXX:LNMI1=+00001')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY3'])).toBe('VXX:LNMI1=+00002')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY4'])).toBe('VXX:LNMI1=+00003')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY5'])).toBe('VXX:LNMI1=+00004')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY6'])).toBe('VXX:LNMI1=+00005')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY7'])).toBe('VXX:LNMI1=+00006')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY8'])).toBe('VXX:LNMI1=+00007')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY9'])).toBe('VXX:LNMI1=+00008')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY10'])).toBe('VXX:LNMI1=+00009')

    // Parse
    expect(cmd.parseResponse('LNMI1=+00000')).toBe(LensMemory['LENS MEMORY1'])
    expect(cmd.parseResponse('LNMI1=+00001')).toBe(LensMemory['LENS MEMORY2'])
    expect(cmd.parseResponse('LNMI1=+00002')).toBe(LensMemory['LENS MEMORY3'])
    expect(cmd.parseResponse('LNMI1=+00003')).toBe(LensMemory['LENS MEMORY4'])
    expect(cmd.parseResponse('LNMI1=+00004')).toBe(LensMemory['LENS MEMORY5'])
    expect(cmd.parseResponse('LNMI1=+00005')).toBe(LensMemory['LENS MEMORY6'])
    expect(cmd.parseResponse('LNMI1=+00006')).toBe(LensMemory['LENS MEMORY7'])
    expect(cmd.parseResponse('LNMI1=+00007')).toBe(LensMemory['LENS MEMORY8'])
    expect(cmd.parseResponse('LNMI1=+00008')).toBe(LensMemory['LENS MEMORY9'])
    expect(cmd.parseResponse('LNMI1=+00009')).toBe(LensMemory['LENS MEMORY10'])
})

test('LENS MEMORY-SAVE specification', () => {
    const cmd = Command.LensMemorySaveCommand

    // Query -> no query

    // Set
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY1'])).toBe('VXX:LNMI2=+00000')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY2'])).toBe('VXX:LNMI2=+00001')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY3'])).toBe('VXX:LNMI2=+00002')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY4'])).toBe('VXX:LNMI2=+00003')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY5'])).toBe('VXX:LNMI2=+00004')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY6'])).toBe('VXX:LNMI2=+00005')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY7'])).toBe('VXX:LNMI2=+00006')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY8'])).toBe('VXX:LNMI2=+00007')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY9'])).toBe('VXX:LNMI2=+00008')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY10'])).toBe('VXX:LNMI2=+00009')

    // Parse
    expect(cmd.parseResponse('LNMI2=+00000')).toBe(LensMemory['LENS MEMORY1'])
    expect(cmd.parseResponse('LNMI2=+00001')).toBe(LensMemory['LENS MEMORY2'])
    expect(cmd.parseResponse('LNMI2=+00002')).toBe(LensMemory['LENS MEMORY3'])
    expect(cmd.parseResponse('LNMI2=+00003')).toBe(LensMemory['LENS MEMORY4'])
    expect(cmd.parseResponse('LNMI2=+00004')).toBe(LensMemory['LENS MEMORY5'])
    expect(cmd.parseResponse('LNMI2=+00005')).toBe(LensMemory['LENS MEMORY6'])
    expect(cmd.parseResponse('LNMI2=+00006')).toBe(LensMemory['LENS MEMORY7'])
    expect(cmd.parseResponse('LNMI2=+00007')).toBe(LensMemory['LENS MEMORY8'])
    expect(cmd.parseResponse('LNMI2=+00008')).toBe(LensMemory['LENS MEMORY9'])
    expect(cmd.parseResponse('LNMI2=+00009')).toBe(LensMemory['LENS MEMORY10'])
})

test('LENS MEMORY-DELETE specification', () => {
    const cmd = Command.LensMemoryDeleteCommand

    // Query -> no query

    // Set
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY1'])).toBe('VXX:LNMI3=+00000')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY2'])).toBe('VXX:LNMI3=+00001')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY3'])).toBe('VXX:LNMI3=+00002')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY4'])).toBe('VXX:LNMI3=+00003')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY5'])).toBe('VXX:LNMI3=+00004')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY6'])).toBe('VXX:LNMI3=+00005')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY7'])).toBe('VXX:LNMI3=+00006')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY8'])).toBe('VXX:LNMI3=+00007')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY9'])).toBe('VXX:LNMI3=+00008')
    expect(cmd.getSetCommand(LensMemory['LENS MEMORY10'])).toBe('VXX:LNMI3=+00009')

    // Parse
    expect(cmd.parseResponse('LNMI3=+00000')).toBe(LensMemory['LENS MEMORY1'])
    expect(cmd.parseResponse('LNMI3=+00001')).toBe(LensMemory['LENS MEMORY2'])
    expect(cmd.parseResponse('LNMI3=+00002')).toBe(LensMemory['LENS MEMORY3'])
    expect(cmd.parseResponse('LNMI3=+00003')).toBe(LensMemory['LENS MEMORY4'])
    expect(cmd.parseResponse('LNMI3=+00004')).toBe(LensMemory['LENS MEMORY5'])
    expect(cmd.parseResponse('LNMI3=+00005')).toBe(LensMemory['LENS MEMORY6'])
    expect(cmd.parseResponse('LNMI3=+00006')).toBe(LensMemory['LENS MEMORY7'])
    expect(cmd.parseResponse('LNMI3=+00007')).toBe(LensMemory['LENS MEMORY8'])
    expect(cmd.parseResponse('LNMI3=+00008')).toBe(LensMemory['LENS MEMORY9'])
    expect(cmd.parseResponse('LNMI3=+00009')).toBe(LensMemory['LENS MEMORY10'])
})

test('LAMP CONTROL STATUS specification', () => {
    const cmd = Command.LampControlStatusCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('Q$S')

    // Set -> no set

    // Parse
    expect(cmd.parseResponse('0')).toBe(LampControlStatus['LAMP OFF'])
    expect(cmd.parseResponse('1')).toBe(LampControlStatus['In turning ON'])
    expect(cmd.parseResponse('2')).toBe(LampControlStatus['LAMP ON'])
    expect(cmd.parseResponse('3')).toBe(LampControlStatus['LAMP Cooling'])
})

test('LAMP STATUS specification', () => {
    const cmd = Command.LampStatusCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QLS')

    // Set -> no set

    // Parse
    expect(cmd.parseResponse('0')).toBe(LampStatus['ALL OFF'])
    expect(cmd.parseResponse('1')).toBe(LampStatus['ALL ON'])
    expect(cmd.parseResponse('2')).toBe(LampStatus['1:ON, 4:ON'])
    expect(cmd.parseResponse('3')).toBe(LampStatus['2:ON, 3:ON'])
    expect(cmd.parseResponse('4')).toBe(LampStatus['1:ON, 2:ON, 3:ON'])
    expect(cmd.parseResponse('5')).toBe(LampStatus['1:ON, 2:ON, 4:ON'])
    expect(cmd.parseResponse('6')).toBe(LampStatus['1:ON, 3:ON, 4:ON'])
    expect(cmd.parseResponse('7')).toBe(LampStatus['2:ON, 3:ON, 4:ON'])
    expect(cmd.parseResponse('8')).toBe(LampStatus['1:ON'])
    expect(cmd.parseResponse('9')).toBe(LampStatus['2:ON'])
    expect(cmd.parseResponse('10')).toBe(LampStatus['3:ON'])
    expect(cmd.parseResponse('11')).toBe(LampStatus['4:ON'])
})

test('TEST PATTERN specification', () => {
    const cmd = Command.TestPatternCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QTS')

    // Set
    expect(cmd.getSetCommand(TestPattern.Off)).toBe('OTS:00')
    expect(cmd.getSetCommand(TestPattern.White)).toBe('OTS:01')
    expect(cmd.getSetCommand(TestPattern.Black)).toBe('OTS:02')
    expect(cmd.getSetCommand(TestPattern.Flag)).toBe('OTS:03')
    expect(cmd.getSetCommand(TestPattern['Flag (Inversion)'])).toBe('OTS:04')
    expect(cmd.getSetCommand(TestPattern.Window)).toBe('OTS:05')
    expect(cmd.getSetCommand(TestPattern['Window (Inversion)'])).toBe('OTS:06')
    expect(cmd.getSetCommand(TestPattern['Crosshatch (White)'])).toBe('OTS:07')
    expect(cmd.getSetCommand(TestPattern['Colorbars (Vertical)'])).toBe('OTS:08')
    expect(cmd.getSetCommand(TestPattern.Lamp)).toBe('OTS:09')
    expect(cmd.getSetCommand(TestPattern.Convergence)).toBe('OTS:11')
    expect(cmd.getSetCommand(TestPattern.Red)).toBe('OTS:22')
    expect(cmd.getSetCommand(TestPattern.Green)).toBe('OTS:23')
    expect(cmd.getSetCommand(TestPattern.Blue)).toBe('OTS:24')
    expect(cmd.getSetCommand(TestPattern['10%-Liminance'])).toBe('OTS:25')
    expect(cmd.getSetCommand(TestPattern['5%-Luminance'])).toBe('OTS:26')
    expect(cmd.getSetCommand(TestPattern.Cyan)).toBe('OTS:28')
    expect(cmd.getSetCommand(TestPattern.Magenta)).toBe('OTS:29')
    expect(cmd.getSetCommand(TestPattern.Yellow)).toBe('OTS:30')
    expect(cmd.getSetCommand(TestPattern['Colorbars (Horizontal)'])).toBe('OTS:51')
    expect(cmd.getSetCommand(TestPattern['16:9 / 4:3'])).toBe('OTS:59')
    expect(cmd.getSetCommand(TestPattern['Crosshatch (Red)'])).toBe('OTS:70')
    expect(cmd.getSetCommand(TestPattern['Crosshatch (Green)'])).toBe('OTS:71')
    expect(cmd.getSetCommand(TestPattern['Crosshatch (Blue)'])).toBe('OTS:72')
    expect(cmd.getSetCommand(TestPattern['Crosshatch (Cyan)'])).toBe('OTS:73')
    expect(cmd.getSetCommand(TestPattern['Crosshatch (Magenta)'])).toBe('OTS:74')
    expect(cmd.getSetCommand(TestPattern['Crosshatch (Yellow)'])).toBe('OTS:75')
    expect(cmd.getSetCommand(TestPattern['3D-1'])).toBe('OTS:80')
    expect(cmd.getSetCommand(TestPattern['3D-2'])).toBe('OTS:81')
    expect(cmd.getSetCommand(TestPattern['3D-3'])).toBe('OTS:82')
    expect(cmd.getSetCommand(TestPattern['3D-4'])).toBe('OTS:83')

    // Parse
    expect(cmd.parseResponse('00')).toBe(TestPattern.Off)
    expect(cmd.parseResponse('01')).toBe(TestPattern.White)
    expect(cmd.parseResponse('02')).toBe(TestPattern.Black)
    expect(cmd.parseResponse('03')).toBe(TestPattern.Flag)
    expect(cmd.parseResponse('04')).toBe(TestPattern['Flag (Inversion)'])
    expect(cmd.parseResponse('05')).toBe(TestPattern.Window)
    expect(cmd.parseResponse('06')).toBe(TestPattern['Window (Inversion)'])
    expect(cmd.parseResponse('07')).toBe(TestPattern['Crosshatch (White)'])
    expect(cmd.parseResponse('08')).toBe(TestPattern['Colorbars (Vertical)'])
    expect(cmd.parseResponse('09')).toBe(TestPattern.Lamp)
    expect(cmd.parseResponse('11')).toBe(TestPattern.Convergence)
    expect(cmd.parseResponse('22')).toBe(TestPattern.Red)
    expect(cmd.parseResponse('23')).toBe(TestPattern.Green)
    expect(cmd.parseResponse('24')).toBe(TestPattern.Blue)
    expect(cmd.parseResponse('25')).toBe(TestPattern['10%-Liminance'])
    expect(cmd.parseResponse('26')).toBe(TestPattern['5%-Luminance'])
    expect(cmd.parseResponse('28')).toBe(TestPattern.Cyan)
    expect(cmd.parseResponse('29')).toBe(TestPattern.Magenta)
    expect(cmd.parseResponse('30')).toBe(TestPattern.Yellow)
    expect(cmd.parseResponse('51')).toBe(TestPattern['Colorbars (Horizontal)'])
    expect(cmd.parseResponse('59')).toBe(TestPattern['16:9 / 4:3'])
    expect(cmd.parseResponse('70')).toBe(TestPattern['Crosshatch (Red)'])
    expect(cmd.parseResponse('71')).toBe(TestPattern['Crosshatch (Green)'])
    expect(cmd.parseResponse('72')).toBe(TestPattern['Crosshatch (Blue)'])
    expect(cmd.parseResponse('73')).toBe(TestPattern['Crosshatch (Cyan)'])
    expect(cmd.parseResponse('74')).toBe(TestPattern['Crosshatch (Magenta)'])
    expect(cmd.parseResponse('75')).toBe(TestPattern['Crosshatch (Yellow)'])
    expect(cmd.parseResponse('80')).toBe(TestPattern['3D-1'])
    expect(cmd.parseResponse('81')).toBe(TestPattern['3D-2'])
    expect(cmd.parseResponse('82')).toBe(TestPattern['3D-3'])
    expect(cmd.parseResponse('83')).toBe(TestPattern['3D-4'])
})

test('BRIGHTNESS CONTROL specification', () => {
    const cmd = Command.BrightnessControlCommand

    // Query
    expect(cmd.getQueryCommand()).toBe('QVX:TGAI0')

    // Set
    expect(cmd.getSetCommand(20)).toBe('VXX:TGAI0=+00020')
    expect(cmd.getSetCommand(50)).toBe('VXX:TGAI0=+00050')
    expect(cmd.getSetCommand(100)).toBe('VXX:TGAI0=+00100')

    // Parse
    expect(cmd.parseResponse('TGAI0=+00010')).toBe(10)
    expect(cmd.parseResponse('TGAI0=+00090')).toBe(90)
    expect(cmd.parseResponse('TGAI0=+00100')).toBe(100)
})
