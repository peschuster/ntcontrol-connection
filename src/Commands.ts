import { ProjectorInput, PictureMode, Geometry, Aspect, ColorMatching, ScreenSetting, ShutterFade, NoSignalShutOff, LensMemory, LampControlStatus, LampStatus, TestPattern, ActionSpeed, ColorTemperature, EdgeBlending, CustomMasking, GenericCommand, BooleanConverter, EnumConverter, DefaultBooleanConverter, DefaultRgbConverter, NumberConverter, DefaultStringConverter, BinaryCommand, DefaultGridSettingConverter } from './Types'

// GENERAL COMMANDS
export const ModelNameCommand = new GenericCommand('ID', 'ModelName', DefaultStringConverter)
export const ProjectorNameCommand = new GenericCommand('XX', 'ProjectorName', DefaultStringConverter, { subname: 'NCGS8' })

// BASIC OPERATION
export const PowerCommand = new GenericCommand('PW', 'Power', new BooleanConverter('001', '000', 'ON', 'OF'), { setOperator: '', setCommand: 'P' })
export const InputSelectCommand = new GenericCommand('IS', 'InputSelect', new EnumConverter<ProjectorInput>(), { queryCommand: 'QIN', setPrefix: 'I' })
export const FreezeCommand = new GenericCommand('FZ', 'Freeze', DefaultBooleanConverter, { setPrefix: 'O' })
export const ShutterCommand = new GenericCommand('SH', 'Shutter', DefaultBooleanConverter, { setPrefix: 'O' })

export const LensShiftHorizontalCommand = new GenericCommand('XX', 'LensShiftHorizontal', new EnumConverter<ActionSpeed>(), { subname: 'LNSI2' })
export const LensShiftVerticalCommand = new GenericCommand('XX', 'LensShiftVertical', new EnumConverter<ActionSpeed>(), { subname: 'LNSI3' })
export const LensFocusCommand = new GenericCommand('XX', 'LensFocus', new EnumConverter<ActionSpeed>(), { subname: 'LNSI4' })
export const LensZoomCommand = new GenericCommand('XX', 'LensZoom', new EnumConverter<ActionSpeed>(), { subname: 'LNSI5' })
export const LensPositionHorizontalCommand = new GenericCommand('XX', 'LensPositionHorizontal', new NumberConverter(-2480, 5), { subname: 'LNSI7' })
export const LensPositionVerticalCommand = new GenericCommand('XX', 'LensPositionVertical', new NumberConverter(-3200, 5), { subname: 'LNSI8' })
export const LensPositionFocusCommand = new GenericCommand('XX', 'LensPositionFocus', new NumberConverter(0, 5, 0, true), { subname: 'LNSI9' })

// PICTURE
export const PictureModeCommand = new GenericCommand('PM', 'PictureMode', new EnumConverter<PictureMode>())
export const ContrastCommand = new GenericCommand('CN', 'Contrast', new NumberConverter(-31, 3, 1), { setPrefix: 'V', queryCommand: 'QVR' })
export const BrightnessCommand = new GenericCommand('BR', 'Brightness', new NumberConverter(-31, 3, 1), { setPrefix: 'V', queryCommand: 'QVB' })
export const ColorCommand = new GenericCommand('CO', 'Color', new NumberConverter(-31, 3, 1), { setPrefix: 'V', queryCommand: 'QVC' })
export const TintCommand = new GenericCommand('TN', 'Tint', new NumberConverter(-31, 3, 1), { setPrefix: 'V', queryCommand: 'QVT' })
export const SharpnessCommand = new GenericCommand('SR', 'Sharpness', new NumberConverter(0, 3, 0), { setPrefix: 'V', queryCommand: 'QVS' })
export const ColorTemperatureCommand = new GenericCommand('TE', 'ColorTemperature', new EnumConverter<ColorTemperature>(), { setPrefix: 'O' })
export const WhiteBalanceLowRedCommand = new GenericCommand('OR', 'WhiteBalanceLowRed', new NumberConverter(-127, 3, 1))
export const WhiteBalanceLowGreenCommand = new GenericCommand('OG', 'WhiteBalanceLowGreen', new NumberConverter(-127, 3, 1))
export const WhiteBalanceLowBlueCommand = new GenericCommand('OB', 'WhiteBalanceLowBlue', new NumberConverter(-127, 3, 1))
export const WhiteBalanceHighRedCommand = new GenericCommand('HR', 'WhiteBalanceHighRed', new NumberConverter(0, 3))
export const WhiteBalanceHighGreenCommand = new GenericCommand('HG', 'WhiteBalanceHighGreen', new NumberConverter(0, 3))
export const WhiteBalanceHighBlueCommand = new GenericCommand('HB', 'WhiteBalanceHighBlue', new NumberConverter(0, 3))

// POSITION
export const GeometryCommand = new GenericCommand('XX', 'Geometry', new EnumConverter<Geometry>(), { subname: 'GMMI0' })
export const ShiftHorizontalCommand = new GenericCommand('TH', 'ShiftHorizontal', new NumberConverter(0, 4))
export const ShiftVerticalCommand = new GenericCommand('TV', 'ShiftVertical', new NumberConverter(0, 4))
export const ClockPhaseCommand = new GenericCommand('CP', 'ClockPhase', new NumberConverter(0, 3))
export const AspectCommand = new GenericCommand('SE', 'Aspect', new EnumConverter<Aspect>())
export const ZoomHorizontalCommand = new GenericCommand('ZH', 'ZoomHorizontal', new NumberConverter(50, 3), { setPrefix: 'O' })
export const ZoomVerticalCommand = new GenericCommand('ZV', 'ZoomVertical', new NumberConverter(50, 3), { setPrefix: 'O' })
export const ZoomBothCommand = new GenericCommand('ZO', 'ZoomBoth', new NumberConverter(50, 3), { setPrefix: 'O' })
export const ZoomModeFullCommand = new GenericCommand('ZT', 'ZoomModeFull', DefaultBooleanConverter, { setPrefix: 'O' })
export const ZoomInterlockedCommand = new GenericCommand('ZS', 'ZoomInterlocked', DefaultBooleanConverter, { setPrefix: 'O' })

// ADVANCED
export const BlankingUpperCommand = new GenericCommand('BU', 'BlankingUpper', new NumberConverter(0, 3), { setPrefix: 'D', queryCommand: 'QLU' })
export const BlankingLowerCommand = new GenericCommand('BB', 'BlankingLower', new NumberConverter(0, 3), { setPrefix: 'D', queryCommand: 'QLB' })
export const BlankingRightCommand = new GenericCommand('BR', 'BlankingRight', new NumberConverter(0, 3), { setPrefix: 'D', queryCommand: 'QLR' })
export const BlankingLeftCommand = new GenericCommand('BL', 'BlankingLeft', new NumberConverter(0, 3), { setPrefix: 'D', queryCommand: 'QLL' })
export const CustomMaskingCommand = new GenericCommand('XX', 'CustomMasking', new EnumConverter<CustomMasking>(), { subname: 'MSKI1' })
export const EdgeBlendingCommand = new GenericCommand('XX', 'EdgeBlending', new EnumConverter<EdgeBlending>(), { subname: 'EDBI0' })
export const EdgeBlendingMarkerCommand = new GenericCommand('GM', 'EdgeBlendingMarker', DefaultBooleanConverter, { setPrefix: 'V' })

export const InputGuideCommand = new GenericCommand('ID', 'InputGuide', DefaultBooleanConverter, { queryCommand: 'QDI', setPrefix: 'O' })

// DISPLAY OPTION
export const ColorMatchingCommand = new GenericCommand('XX', 'ColorMatching', new EnumConverter<ColorMatching>(), { subname: 'CMAI0' })
export const ColorMatching3ColorsRedCommand = new GenericCommand('MR', 'ColorMatching3ColorsRed', DefaultRgbConverter)
export const ColorMatching3ColorsGreenCommand = new GenericCommand('MG', 'ColorMatching3ColorsGreen', DefaultRgbConverter)
export const ColorMatching3ColorsBlueCommand = new GenericCommand('MB', 'ColorMatching3ColorsBlue', DefaultRgbConverter)
export const ColorMatching3ColorsWhiteCommand = new GenericCommand('MW', 'ColorMatching3ColorsWhite', new NumberConverter(256, 4, 256))
export const ColorMatching3ColorsAutoTestpatternCommand = new GenericCommand('XX', 'ColorMatching3ColorsAutoTestpattern', new BooleanConverter('+00001', '+00000'), { subname: 'CATI0' })
export const ColorMatching7ColorsRedCommand = new GenericCommand('XX', 'ColorMatching7ColorsRed', DefaultRgbConverter, { subname: 'C7CS0' })
export const ColorMatching7ColorsGreenCommand = new GenericCommand('XX', 'ColorMatching7ColorsGreen', DefaultRgbConverter, { subname: 'C7CS1' })
export const ColorMatching7ColorsBlueCommand = new GenericCommand('XX', 'ColorMatching7ColorsBlue', DefaultRgbConverter, { subname: 'C7CS2' })
export const ColorMatching7ColorsCyanCommand = new GenericCommand('XX', 'ColorMatching7ColorsCyan', DefaultRgbConverter, { subname: 'C7CS3' })
export const ColorMatching7ColorsMagentaCommand = new GenericCommand('XX', 'ColorMatching7ColorsMagenta', DefaultRgbConverter, { subname: 'C7CS4' })
export const ColorMatching7ColorsYellowCommand = new GenericCommand('XX', 'ColorMatching7ColorsYellow', DefaultRgbConverter, { subname: 'C7CS5' })
export const ColorMatching7ColorsWhiteCommand = new GenericCommand('XX', 'ColorMatching7ColorsWhite', DefaultRgbConverter, { subname: 'C7CS6' })
export const ColorMatching7ColorsAutoTestpatternCommand = new GenericCommand('XX', 'ColorMatching7ColorsAutoTestpattern', new BooleanConverter('+00001', '+00000'), { subname: 'CATI1' })

export const OnScreenCommand = new GenericCommand('OS', 'OnScreen', DefaultBooleanConverter, { setPrefix: 'O' })
export const ScreenSettingCommand = new GenericCommand('SF', 'ScreenSetting', new EnumConverter<ScreenSetting>())

export const ShutterFadeInCommand = new GenericCommand('XX', 'ShutterFadeIn', new EnumConverter<ShutterFade>(), { subname: 'SEFS1' })
export const ShutterFadeOutCommand = new GenericCommand('XX', 'ShutterFadeOut', new EnumConverter<ShutterFade>(), { subname: 'SEFS2' })

// PROJECTOR SETUP
export const ProjectorIdCommand = new GenericCommand('IS', 'ProjectorId', new NumberConverter(0, 2), { setPrefix: 'R' })
export const IdAllCommand = new GenericCommand('VY', 'IdAll', DefaultBooleanConverter, { setCommand: 'RVS' })

export const NoSignalShutOffCommand = new GenericCommand('AF', 'NoSignalShutOff', new EnumConverter<NoSignalShutOff>(), { setPrefix: 'O' })

export const LensMemoryLoadCommand = new GenericCommand('XX', 'LensMemoryLoad', new EnumConverter<LensMemory>(), { subname: 'LNMI1' })
export const LensMemorySaveCommand = new GenericCommand('XX', 'LensMemorySave', new EnumConverter<LensMemory>(), { subname: 'LNMI2' })
export const LensMemoryDeleteCommand = new GenericCommand('XX', 'LensMemoryDelete', new EnumConverter<LensMemory>(), { subname: 'LNMI3' })

export const LampControlStatusCommand = new GenericCommand('$S', 'LampControlStatus', new EnumConverter<LampControlStatus>())
export const LampStatusCommand = new GenericCommand('LS', 'LampStatus', new EnumConverter<LampStatus>())

// P IN P

// TEST PATTERN
export const TestPatternCommand = new GenericCommand('TS', 'TestPattern', new EnumConverter<TestPattern>(), { setPrefix: 'O' })

export const BrightnessControlCommand = new GenericCommand('XX', 'BrightnessControl', new NumberConverter(20, 5, 20 ,true), { subname: 'TGAI0' })

// Binary Commands
export const GridSettingsCommand = new BinaryCommand('AB07', 'GridSettings', DefaultGridSettingConverter)
export const StatusDisplayCommand = new BinaryCommand('D0F', 'StatusDisplay', new BooleanConverter('301', '000'))
