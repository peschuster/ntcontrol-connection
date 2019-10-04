import { BooleanCommand, EnumCommand, NumberRangeCommand, ProjectorInput, PictureMode, Geometry, Aspect, ColorMatching, ScreenSetting, ShutterFade, NoSignalShutOff, LensMemory, LampControlStatus, LampStatus, TestPattern, ActionSpeed, ColorTemperature } from './Types'

// BASIC OPERATION
export const PowerCommand = new BooleanCommand('PW', '001', '000', (v) => v ? 'PON' : 'POF')
export const InputSelectCommand = new EnumCommand<ProjectorInput>('IS', 'QIN', undefined, 'I')
export const FreezeCommand = new BooleanCommand('FZ')
export const ShutterCommand = new BooleanCommand('SH')

export const LensShiftHorizontalCommand = new EnumCommand<ActionSpeed>('XX', undefined, 'LNSI2')
export const LensShiftVerticalCommand = new EnumCommand<ActionSpeed>('XX', undefined, 'LNSI3')
export const LensFocusCommand = new EnumCommand<ActionSpeed>('XX', undefined, 'LNSI4')
export const LensZoomCommand = new EnumCommand<ActionSpeed>('XX', undefined, 'LNSI5')
export const LensPositionHorizontalCommand = new NumberRangeCommand('XX', -2480, 2480, -2480, 5, 'LNSI7')
export const LensPositionVerticalCommand = new NumberRangeCommand('XX', -3200, 3200, -3200, 5, 'LNSI8')
export const LensPositionFocusCommand = new NumberRangeCommand('XX', 0, 2560, 0, 5, 'LNSI9', undefined, undefined, true)

// PICTURE
export const PictureModeCommand = new EnumCommand<PictureMode>('PM')
export const ContrastCommand = new NumberRangeCommand('CN', -31, 31, 1, 3, undefined, 'V', 'QVR')
export const BrightnessCommand = new NumberRangeCommand('BR', -31, 31, 1, 3, undefined, 'V', 'QVB')
export const ColorCommand = new NumberRangeCommand('CO', -31, 31, 1, 3, undefined, 'V', 'QVC')
export const TintCommand = new NumberRangeCommand('TN', -31, 31, 1, 3, undefined, 'V', 'QVT')
export const SharpnessCommand = new NumberRangeCommand('SR', 0, 15, 0, 3, undefined, 'V', 'QVS')
export const ColorTemperatureCommand = new EnumCommand<ColorTemperature>('TE', undefined, undefined, 'O')
export const WhiteBalanceLowRedCommand = new NumberRangeCommand('OR', -127, +127, 1, 3, undefined, 'V')
export const WhiteBalanceLowGreenCommand = new NumberRangeCommand('OG', -127, +127, 1, 3, undefined, 'V')
export const WhiteBalanceLowBlueCommand = new NumberRangeCommand('OB', -127, +127, 1, 3, undefined, 'V')
export const WhiteBalanceHighRedCommand = new NumberRangeCommand('HR', 0, 255, 0, 3, undefined, 'V')
export const WhiteBalanceHighGreenCommand = new NumberRangeCommand('HG', 0, 255, 0, 3, undefined, 'V')
export const WhiteBalanceHighBlueCommand = new NumberRangeCommand('HB', 0, 255, 0, 3, undefined, 'V')

// POSITION
export const GeometryCommand = new EnumCommand<Geometry>('XX', undefined, 'GMMI0')
export const AspectCommand = new EnumCommand<Aspect>('SE')

export const ZoomHorizontalCommand = new NumberRangeCommand('ZH', 50, 999, 1, 3, 'OZH')
export const ZoomVerticalCommand = new NumberRangeCommand('ZV', 50, 999, 1, 3, 'OZV')
export const ZoomModeFullCommand = new BooleanCommand('ZT')
export const ZoomInterlockedCommand = new BooleanCommand('ZS')

// ADVANCED
export const EdgeBlendingMarkerCommand = new BooleanCommand('GM')

export const InputGuidCommand = new BooleanCommand('ID', '1', '0', undefined, () => 'QDI')

// DISPLAY OPTION
export const ColorMatchingCommand = new EnumCommand<ColorMatching>('XX', undefined, 'CMAI0')

export const OnScreenCommand = new BooleanCommand('OS')
export const ScreenSettingCommand = new EnumCommand<ScreenSetting>('SF')

export const ShutterFadeInCommand = new EnumCommand<ShutterFade>('XX', undefined, 'SEFS1')
export const ShutterFadeOutCommand = new EnumCommand<ShutterFade>('XX', undefined, 'SEFS2')

// PROJECTOR SETUP
export const IdAllCommand = new BooleanCommand('VY', '1', '0', (v) => v ? 'RVS:1' : 'RVS:0')

export const NoSignalShutOffCommand = new EnumCommand<NoSignalShutOff>('AF', undefined, undefined, 'O')

export const LensMemoryLoadCommand = new EnumCommand<LensMemory>('XX', undefined, 'LNMI1')
export const LensMemorySaveCommand = new EnumCommand<LensMemory>('XX', undefined, 'LNMI2')
export const LensMemoryDeleteCommand = new EnumCommand<LensMemory>('XX', undefined, 'LNMI3')

export const LampControlStatusCommand = new EnumCommand<LampControlStatus>('$S')
export const LampStatusCommand = new EnumCommand<LampStatus>('LS')

// P IN P

// TEST PATTERN
export const TestPatternCommand = new EnumCommand<TestPattern>('TS', undefined, undefined, 'O')
