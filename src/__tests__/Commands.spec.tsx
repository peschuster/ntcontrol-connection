import { PowerCommand, InputSelectCommand, FreezeCommand, ShutterCommand, LensShiftHorizontalCommand, LensShiftVerticalCommand, LensFocusCommand, LensZoomCommand, LensPositionHorizontalCommand, LensPositionVerticalCommand, LensPositionFocusCommand, PictureModeCommand, ContrastCommand, BrightnessCommand, ColorCommand, TintCommand, SharpnessCommand, ColorTemperatureCommand, WhiteBalanceLowRedCommand, WhiteBalanceLowGreenCommand, WhiteBalanceLowBlueCommand, WhiteBalanceHighRedCommand, WhiteBalanceHighGreenCommand, WhiteBalanceHighBlueCommand, GeometryCommand, AspectCommand, ZoomHorizontalCommand, ZoomBothCommand, ZoomVerticalCommand, ShiftHorizontalCommand, ShiftVerticalCommand, ClockPhaseCommand } from '../Commands'
import { ProjectorInput, ActionSpeed, PictureMode, ColorTemperature, GenericCommandInterface, Geometry, Aspect } from '../Types'

test('POWER specification', () => {
    // Query
    expect(PowerCommand.getQueryCommand()).toBe('QPW')

    // Set
    expect(PowerCommand.getSetCommand(true)).toBe('PON')
    expect(PowerCommand.getSetCommand(false)).toBe('POF')

    // Parse
    expect(PowerCommand.parseResponse('000')).toBe(false)
    expect(PowerCommand.parseResponse('001')).toBe(true)
})

test('INPUT SELECT specification', () => {
    // Query
    expect(InputSelectCommand.getQueryCommand()).toBe('QIN')

    // Set
    expect(InputSelectCommand.getSetCommand(ProjectorInput.COMPUTER1)).toBe('IIS:RG1')
    expect(InputSelectCommand.getSetCommand(ProjectorInput.COMPUTER2)).toBe('IIS:RG2')
    expect(InputSelectCommand.getSetCommand(ProjectorInput.VIDEO)).toBe('IIS:VID')
    expect(InputSelectCommand.getSetCommand(ProjectorInput['Y/C'])).toBe('IIS:SVD')
    expect(InputSelectCommand.getSetCommand(ProjectorInput.DVI)).toBe('IIS:DVI')
    expect(InputSelectCommand.getSetCommand(ProjectorInput.HDMI1)).toBe('IIS:HD1')
    expect(InputSelectCommand.getSetCommand(ProjectorInput.SDI1)).toBe('IIS:SD1')
    expect(InputSelectCommand.getSetCommand(ProjectorInput.SDI2)).toBe('IIS:SD2')
    expect(InputSelectCommand.getSetCommand(ProjectorInput['DIGITAL LINK'])).toBe('IIS:DL1')

    // Parse
    expect(InputSelectCommand.parseResponse('RG1')).toBe(ProjectorInput.COMPUTER1)
    expect(InputSelectCommand.parseResponse('RG2')).toBe(ProjectorInput.COMPUTER2)
    expect(InputSelectCommand.parseResponse('VID')).toBe(ProjectorInput.VIDEO)
    expect(InputSelectCommand.parseResponse('SVD')).toBe(ProjectorInput['Y/C'])
    expect(InputSelectCommand.parseResponse('DVI')).toBe(ProjectorInput.DVI)
    expect(InputSelectCommand.parseResponse('HD1')).toBe(ProjectorInput.HDMI1)
    expect(InputSelectCommand.parseResponse('SD1')).toBe(ProjectorInput.SDI1)
    expect(InputSelectCommand.parseResponse('SD2')).toBe(ProjectorInput.SDI2)
    expect(InputSelectCommand.parseResponse('DL1')).toBe(ProjectorInput['DIGITAL LINK'])
})

test('FREEZE specification', () => {
    // Query
    expect(FreezeCommand.getQueryCommand()).toBe('QFZ')

    // Set
    expect(FreezeCommand.getSetCommand(true)).toBe('OFZ:1')
    expect(FreezeCommand.getSetCommand(false)).toBe('OFZ:0')

    // Parse
    expect(FreezeCommand.parseResponse('0')).toBe(false)
    expect(FreezeCommand.parseResponse('1')).toBe(true)
})

test('SHUTTER specification', () => {
    // Query
    expect(ShutterCommand.getQueryCommand()).toBe('QSH')

    // Set
    expect(ShutterCommand.getSetCommand(true)).toBe('OSH:1')
    expect(ShutterCommand.getSetCommand(false)).toBe('OSH:0')

    // Parse
    expect(ShutterCommand.parseResponse('0')).toBe(false)
    expect(ShutterCommand.parseResponse('1')).toBe(true)
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
    testActionSpeeds(LensShiftHorizontalCommand, 'LNSI2')
})

test('LENS-SHIFT VERTIVAL specification', () => {
    testActionSpeeds(LensShiftVerticalCommand, 'LNSI3')
})

test('LENS FOCUS specification', () => {
    testActionSpeeds(LensFocusCommand, 'LNSI4')
})

test('LENS ZOOM specification', () => {
    testActionSpeeds(LensZoomCommand, 'LNSI5')
})

test('LENS POSITION HORIZONTAL specification', () => {
    // Query
    expect(LensPositionHorizontalCommand.getQueryCommand()).toBe('QVX:LNSI7')

    // Set
    expect(LensPositionHorizontalCommand.getSetCommand(-2480)).toBe('VXX:LNSI7=-02480')
    expect(LensPositionHorizontalCommand.getSetCommand(2480)).toBe('VXX:LNSI7=+02480')
    expect(LensPositionHorizontalCommand.getSetCommand(-100)).toBe('VXX:LNSI7=-00100')
    expect(LensPositionHorizontalCommand.getSetCommand(0)).toBe('VXX:LNSI7=+00000')

    // Parse
    expect(LensPositionHorizontalCommand.parseResponse('LNSI7=-02480')).toBe(-2480)
    expect(LensPositionHorizontalCommand.parseResponse('LNSI7=+02480')).toBe(2480)
    expect(LensPositionHorizontalCommand.parseResponse('LNSI7=+00000')).toBe(0)
})

test('LENS POSITION VERTICAL specification', () => {
    // Query
    expect(LensPositionVerticalCommand.getQueryCommand()).toBe('QVX:LNSI8')

    // Set
    expect(LensPositionVerticalCommand.getSetCommand(-3200)).toBe('VXX:LNSI8=-03200')
    expect(LensPositionVerticalCommand.getSetCommand(3200)).toBe('VXX:LNSI8=+03200')
    expect(LensPositionVerticalCommand.getSetCommand(-100)).toBe('VXX:LNSI8=-00100')
    expect(LensPositionVerticalCommand.getSetCommand(0)).toBe('VXX:LNSI8=+00000')

    // Parse
    expect(LensPositionVerticalCommand.parseResponse('LNSI8=-03200')).toBe(-3200)
    expect(LensPositionVerticalCommand.parseResponse('LNSI8=+03200')).toBe(3200)
    expect(LensPositionVerticalCommand.parseResponse('LNSI8=+00000')).toBe(0)
})

test('LENS POSITION FOCUS specification', () => {
    // Query
    expect(LensPositionFocusCommand.getQueryCommand()).toBe('QVX:LNSI9')

    // Set
    expect(LensPositionFocusCommand.getSetCommand(0)).toBe('VXX:LNSI9=+00000')
    expect(LensPositionFocusCommand.getSetCommand(20)).toBe('VXX:LNSI9=+00020')
    expect(LensPositionFocusCommand.getSetCommand(2560)).toBe('VXX:LNSI9=+02560')

    // Parse
    expect(LensPositionFocusCommand.parseResponse('LNSI9=+00000')).toBe(0)
    expect(LensPositionFocusCommand.parseResponse('LNSI9=+00020')).toBe(20)
    expect(LensPositionFocusCommand.parseResponse('LNSI9=+02560')).toBe(2560)
})

test('PICTURE MODE specification', () => {
    // Query
    expect(PictureModeCommand.getQueryCommand()).toBe('QPM')

    // Set
    expect(PictureModeCommand.getSetCommand(PictureMode.DYNAMIC)).toBe('VPM:DYN')
    expect(PictureModeCommand.getSetCommand(PictureMode.NATURAL)).toBe('VPM:NAT')
    expect(PictureModeCommand.getSetCommand(PictureMode.STANDARD)).toBe('VPM:STD')
    expect(PictureModeCommand.getSetCommand(PictureMode.CINEMA)).toBe('VPM:CIN')
    expect(PictureModeCommand.getSetCommand(PictureMode.GRAPHIC)).toBe('VPM:GRA')
    expect(PictureModeCommand.getSetCommand(PictureMode['DICOM SIM'])).toBe('VPM:DIC')
    expect(PictureModeCommand.getSetCommand(PictureMode.USER)).toBe('VPM:USR')

    // Parse
    expect(PictureModeCommand.parseResponse('DYN')).toBe(PictureMode.DYNAMIC)
    expect(PictureModeCommand.parseResponse('NAT')).toBe(PictureMode.NATURAL)
    expect(PictureModeCommand.parseResponse('STD')).toBe(PictureMode.STANDARD)
    expect(PictureModeCommand.parseResponse('CIN')).toBe(PictureMode.CINEMA)
    expect(PictureModeCommand.parseResponse('GRA')).toBe(PictureMode.GRAPHIC)
    expect(PictureModeCommand.parseResponse('DIC')).toBe(PictureMode['DICOM SIM'])
    expect(PictureModeCommand.parseResponse('USR')).toBe(PictureMode.USER)
})

test('CONTRAST specification', () => {
    // Query
    expect(ContrastCommand.getQueryCommand()).toBe('QVR')

    // Set
    expect(ContrastCommand.getSetCommand(-31)).toBe('VCN:001')
    expect(ContrastCommand.getSetCommand(0)).toBe('VCN:032')
    expect(ContrastCommand.getSetCommand(31)).toBe('VCN:063')

    // Parse
    expect(ContrastCommand.parseResponse('001')).toBe(-31)
    expect(ContrastCommand.parseResponse('032')).toBe(0)
    expect(ContrastCommand.parseResponse('063')).toBe(31)
})

test('BRIGHTNESS specification', () => {
    // Query
    expect(BrightnessCommand.getQueryCommand()).toBe('QVB')

    // Set
    expect(BrightnessCommand.getSetCommand(-31)).toBe('VBR:001')
    expect(BrightnessCommand.getSetCommand(0)).toBe('VBR:032')
    expect(BrightnessCommand.getSetCommand(31)).toBe('VBR:063')

    // Parse
    expect(BrightnessCommand.parseResponse('001')).toBe(-31)
    expect(BrightnessCommand.parseResponse('032')).toBe(0)
    expect(BrightnessCommand.parseResponse('063')).toBe(31)
})

test('COLOR specification', () => {
    // Query
    expect(ColorCommand.getQueryCommand()).toBe('QVC')

    // Set
    expect(ColorCommand.getSetCommand(-31)).toBe('VCO:001')
    expect(ColorCommand.getSetCommand(0)).toBe('VCO:032')
    expect(ColorCommand.getSetCommand(31)).toBe('VCO:063')

    // Parse
    expect(ColorCommand.parseResponse('001')).toBe(-31)
    expect(ColorCommand.parseResponse('032')).toBe(0)
    expect(ColorCommand.parseResponse('063')).toBe(31)
})

test('TINT specification', () => {
    // Query
    expect(TintCommand.getQueryCommand()).toBe('QVT')

    // Set
    expect(TintCommand.getSetCommand(-31)).toBe('VTN:001')
    expect(TintCommand.getSetCommand(0)).toBe('VTN:032')
    expect(TintCommand.getSetCommand(31)).toBe('VTN:063')

    // Parse
    expect(TintCommand.parseResponse('001')).toBe(-31)
    expect(TintCommand.parseResponse('032')).toBe(0)
    expect(TintCommand.parseResponse('063')).toBe(31)
})

test('SHARPNESS specification', () => {
    // Query
    expect(SharpnessCommand.getQueryCommand()).toBe('QVS')

    // Set
    expect(SharpnessCommand.getSetCommand(0)).toBe('VSR:000')
    expect(SharpnessCommand.getSetCommand(5)).toBe('VSR:005')
    expect(SharpnessCommand.getSetCommand(15)).toBe('VSR:015')

    // Parse
    expect(SharpnessCommand.parseResponse('000')).toBe(0)
    expect(SharpnessCommand.parseResponse('005')).toBe(5)
    expect(SharpnessCommand.parseResponse('015')).toBe(15)
})

test('COLOR TEMPERATURE specification', () => {
    // Query
    expect(ColorTemperatureCommand.getQueryCommand()).toBe('QTE')

    // Set
    expect(ColorTemperatureCommand.getSetCommand(ColorTemperature.DEFAULT)).toBe('OTE:1')
    expect(ColorTemperatureCommand.getSetCommand(ColorTemperature.USER1)).toBe('OTE:04')
    expect(ColorTemperatureCommand.getSetCommand(ColorTemperature.USER2)).toBe('OTE:09')
    expect(ColorTemperatureCommand.getSetCommand(ColorTemperature['3200K'])).toBe('OTE:3200')
    expect(ColorTemperatureCommand.getSetCommand(ColorTemperature['3300K'])).toBe('OTE:3300')
    expect(ColorTemperatureCommand.getSetCommand(ColorTemperature['9200K'])).toBe('OTE:9200')
    expect(ColorTemperatureCommand.getSetCommand(ColorTemperature['9300K'])).toBe('OTE:9300')

    // Parse
    expect(ColorTemperatureCommand.parseResponse('1')).toBe(ColorTemperature.DEFAULT)
    expect(ColorTemperatureCommand.parseResponse('04')).toBe(ColorTemperature.USER1)
    expect(ColorTemperatureCommand.parseResponse('09')).toBe(ColorTemperature.USER2)
    expect(ColorTemperatureCommand.parseResponse('3200')).toBe(ColorTemperature['3200K'])
    expect(ColorTemperatureCommand.parseResponse('3300')).toBe(ColorTemperature['3300K'])
    expect(ColorTemperatureCommand.parseResponse('9200')).toBe(ColorTemperature['9200K'])
    expect(ColorTemperatureCommand.parseResponse('9300')).toBe(ColorTemperature['9300K'])
})

test('WHITE BALANCE LOW RED specification', () => {
    const cmd = WhiteBalanceLowRedCommand

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
    const cmd = WhiteBalanceLowGreenCommand

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
    const cmd = WhiteBalanceLowBlueCommand

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
    const cmd = WhiteBalanceHighRedCommand

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
    const cmd = WhiteBalanceHighGreenCommand

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
    const cmd = WhiteBalanceHighBlueCommand

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
    const cmd = GeometryCommand

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
    const cmd = ShiftHorizontalCommand

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
    const cmd = ShiftVerticalCommand

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
    const cmd = ClockPhaseCommand

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
    const cmd = AspectCommand

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
    testZoomCommand(ZoomHorizontalCommand, 'ZH')
})

test('ZOOM-VERTICAL specification', () => {
    testZoomCommand(ZoomVerticalCommand, 'ZV')
})

test('ZOOM-BOTH specification', () => {
    testZoomCommand(ZoomBothCommand, 'ZO')
})
