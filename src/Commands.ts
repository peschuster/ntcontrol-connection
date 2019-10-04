import { ProjectorInput, PictureMode, Geometry, Aspect, ColorMatching, ScreenSetting, ShutterFade, NoSignalShutOff, LensMemory, LampControlStatus, LampStatus, TestPattern, ActionSpeed, ColorTemperature, EdgeBlending, CustomMasking, GenericCommand, BooleanConverter, EnumConverter, DefaultBooleanConverter, DefaultRgbConverter, NumberConverter } from './Types'

// BASIC OPERATION
export const PowerCommand = new GenericCommand('PW', new BooleanConverter('001', '000', 'ON', 'OF'), { setCommand: 'P' })
export const InputSelectCommand = new GenericCommand('IS', new EnumConverter<ProjectorInput>(), { queryCommand: 'QIN', setPrefix: 'I' })
export const FreezeCommand = new GenericCommand('FZ', DefaultBooleanConverter, { setPrefix: 'O' })
export const ShutterCommand = new GenericCommand('SH', DefaultBooleanConverter, { setPrefix: 'O' })

export const LensShiftHorizontalCommand = new GenericCommand('XX', new EnumConverter<ActionSpeed>(), { subname: 'LNSI2' })
export const LensShiftVerticalCommand = new GenericCommand('XX', new EnumConverter<ActionSpeed>(), { subname: 'LNSI3' })
export const LensFocusCommand = new GenericCommand('XX', new EnumConverter<ActionSpeed>(), { subname: 'LNSI4' })
export const LensZoomCommand = new GenericCommand('XX', new EnumConverter<ActionSpeed>(), { subname: 'LNSI5' })
export const LensPositionHorizontalCommand = new GenericCommand('XX', new NumberConverter(-2480, 5), { subname: 'LNSI7' })
export const LensPositionVerticalCommand = new GenericCommand('XX', new NumberConverter(-3200, 5), { subname: 'LNSI8' })
export const LensPositionFocusCommand = new GenericCommand('XX', new NumberConverter(0, 5, 0, true), { subname: 'LNSI9' })

// PICTURE
export const PictureModeCommand = new GenericCommand('PM', new EnumConverter<PictureMode>())
export const ContrastCommand = new GenericCommand('CN', new NumberConverter(-31, 3, 1), { setPrefix: 'V', queryCommand: 'QVR' })
export const BrightnessCommand = new GenericCommand('BR', new NumberConverter(-31, 3, 1), { setPrefix: 'V', queryCommand: 'QVB' })
export const ColorCommand = new GenericCommand('CO', new NumberConverter(-31, 3, 1), { setPrefix: 'V', queryCommand: 'QVC' })
export const TintCommand = new GenericCommand('TN', new NumberConverter(-31, 3, 1), { setPrefix: 'V', queryCommand: 'QVT' })
export const SharpnessCommand = new GenericCommand('SR', new NumberConverter(0, 3, 0), { setPrefix: 'V', queryCommand: 'QVS' })
export const ColorTemperatureCommand = new GenericCommand('TE', new EnumConverter<ColorTemperature>(), { setPrefix: 'O' })
export const WhiteBalanceLowRedCommand = new GenericCommand('OR', new NumberConverter(-127, 3, 1))
export const WhiteBalanceLowGreenCommand = new GenericCommand('OG', new NumberConverter(-127, 3, 1))
export const WhiteBalanceLowBlueCommand = new GenericCommand('OB', new NumberConverter(-127, 3, 1))
export const WhiteBalanceHighRedCommand = new GenericCommand('HR', new NumberConverter(0, 3))
export const WhiteBalanceHighGreenCommand = new GenericCommand('HG', new NumberConverter(0, 3))
export const WhiteBalanceHighBlueCommand = new GenericCommand('HB', new NumberConverter(0, 3))

// POSITION
export const GeometryCommand = new GenericCommand('XX', new EnumConverter<Geometry>(), { subname: 'GMMI0' })
export const ShiftHorizontalCommand = new GenericCommand('TH', new NumberConverter(0, 4))
export const ShiftVerticalCommand = new GenericCommand('TV', new NumberConverter(0, 4))
export const ClockPhaseCommand = new GenericCommand('CP', new NumberConverter(0, 3))
export const AspectCommand = new GenericCommand('SE', new EnumConverter<Aspect>())
export const ZoomHorizontalCommand = new GenericCommand('ZH', new NumberConverter(50, 3), { setPrefix: 'O' })
export const ZoomVerticalCommand = new GenericCommand('ZV', new NumberConverter(50, 3), { setPrefix: 'O' })
export const ZoomBothCommand = new GenericCommand('ZO', new NumberConverter(50, 3), { setPrefix: 'O' })
export const ZoomModeFullCommand = new GenericCommand('ZT', DefaultBooleanConverter, { setPrefix: 'O' })
export const ZoomInterlockedCommand = new GenericCommand('ZS', DefaultBooleanConverter, { setPrefix: 'O' })

// ADVANCED
export const BlankingUpperCommand = new GenericCommand('BU', new NumberConverter(0, 3), { setPrefix: 'D', queryCommand: 'QLU' })
export const BlankingLowerCommand = new GenericCommand('BB', new NumberConverter(0, 3), { setPrefix: 'D', queryCommand: 'QLB' })
export const BlankingRightCommand = new GenericCommand('BR', new NumberConverter(0, 3), { setPrefix: 'D', queryCommand: 'QLR' })
export const BlankingLeftCommand = new GenericCommand('BL', new NumberConverter(0, 3), { setPrefix: 'D', queryCommand: 'QLL' })
export const CustomMaskingCommand = new GenericCommand('XX', new EnumConverter<CustomMasking>(), { subname: 'MSKI1' })
export const EdgeBlendingCommand = new GenericCommand('XX', new EnumConverter<EdgeBlending>(), { subname: 'EDBI0' })
export const EdgeBlendingMarkerCommand = new GenericCommand('GM', DefaultBooleanConverter, { setPrefix: 'O' })

export const InputGuidCommand = new GenericCommand('ID', DefaultBooleanConverter, { queryCommand: 'QDI' })

// DISPLAY OPTION
export const ColorMatchingCommand = new GenericCommand('XX', new EnumConverter<ColorMatching>(), { subname: 'CMAI0' })
export const ColorMatching3ColorsRedCommand = new GenericCommand('MR', DefaultRgbConverter)
export const ColorMatching3ColorsGreenCommand = new GenericCommand('MG', DefaultRgbConverter)
export const ColorMatching3ColorsBlueCommand = new GenericCommand('MB', DefaultRgbConverter)
export const ColorMatching3ColorsWhiteCommand = new GenericCommand('MW', new NumberConverter(256, 4, 256))
export const ColorMatching3ColorsAutoTestpatternCommand = new GenericCommand('XX', new BooleanConverter('+00001', '+00000'), { subname: 'CATI0' })
export const ColorMatching7ColorsRedCommand = new GenericCommand('XX', DefaultRgbConverter, { subname: 'C7CS0' })
export const ColorMatching7ColorsGreenCommand = new GenericCommand('XX', DefaultRgbConverter, { subname: 'C7CS1' })
export const ColorMatching7ColorsBlueCommand = new GenericCommand('XX', DefaultRgbConverter, { subname: 'C7CS2' })
export const ColorMatching7ColorsCyanCommand = new GenericCommand('XX', DefaultRgbConverter, { subname: 'C7CS3' })
export const ColorMatching7ColorsMagentaCommand = new GenericCommand('XX', DefaultRgbConverter, { subname: 'C7CS4' })
export const ColorMatching7ColorsYellowCommand = new GenericCommand('XX', DefaultRgbConverter, { subname: 'C7CS5' })
export const ColorMatching7ColorsWhiteCommand = new GenericCommand('XX', DefaultRgbConverter, { subname: 'C7CS6' })
export const ColorMatching7ColorsAutoTestpatternCommand = new GenericCommand('XX', new BooleanConverter('+00001', '+00000'), { subname: 'CATI1' })

export const OnScreenCommand = new GenericCommand('OS', DefaultBooleanConverter, { setPrefix: 'O' })
export const ScreenSettingCommand = new GenericCommand('SF', new EnumConverter<ScreenSetting>())

export const ShutterFadeInCommand = new GenericCommand('XX', new EnumConverter<ShutterFade>(), { subname: 'SEFS1' })
export const ShutterFadeOutCommand = new GenericCommand('XX', new EnumConverter<ShutterFade>(), { subname: 'SEFS2' })

// PROJECTOR SETUP
export const IdAllCommand = new GenericCommand('VY', DefaultBooleanConverter, { setCommand: 'RVS:' })

export const NoSignalShutOffCommand = new GenericCommand('AF', new EnumConverter<NoSignalShutOff>(), { setPrefix: 'O' })

export const LensMemoryLoadCommand = new GenericCommand('XX', new EnumConverter<LensMemory>(), { subname: 'LNMI1' })
export const LensMemorySaveCommand = new GenericCommand('XX', new EnumConverter<LensMemory>(), { subname: 'LNMI2' })
export const LensMemoryDeleteCommand = new GenericCommand('XX', new EnumConverter<LensMemory>(), { subname: 'LNMI3' })

export const LampControlStatusCommand = new GenericCommand('$S', new EnumConverter<LampControlStatus>())
export const LampStatusCommand = new GenericCommand('LS', new EnumConverter<LampStatus>())

// P IN P

// TEST PATTERN
export const TestPatternCommand = new GenericCommand('TS', new EnumConverter<TestPattern>(), { setPrefix: 'O' })
