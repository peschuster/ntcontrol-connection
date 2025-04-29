
export enum ProjectorInput {
    COMPUTER1 = 'RG1',
    COMPUTER2 = 'RG2',
    VIDEO = 'VID',
    'Y/C' = 'SVD',
    DVI = 'DVI',
    HDMI1 = 'HD1',
    HDMI2 = 'HD2',
    HDMI3 = 'HD3',
    'NETWORK/USB' = 'NWP',
    'Panasonic Application' = 'PA1',
    'Miracast/Mirroring' = 'MC1',
    'MEMORY VIEWER' = 'MV1',
    SDI1 = 'SD1',
    SDI2 = 'SD2',
    'DIGITAL LINK' = 'DL1'
}

export enum PictureMode {
    DYNAMIC = 'DYN',
    NATURAL = 'NAT',
    STANDARD = 'STD',
    'BLACK BOARD' = 'BBD',
    'WHITE BOARD' = 'WBD',
    CINEMA = 'CIN',
    GRAPHIC = 'GRA',
    'DICOM SIM' = 'DIC',
    USER = 'USR'
}

export enum ColorTemperature {
    LOW = '0',
    DEFAULT = '1',
    HIGH = '2',
    USER1 = '04',
    USER2 = '09',
    '3200K' = '3200',
    '3300K' = '3300',
    '9200K' = '9200',
    '9300K' = '9300'
}

export enum Geometry {
    OFF = '+00000',
    KEYSTONE = '+00001',
    CURVED = '+00002',
    'PC-1' = '+00003',
    'PC-2' = '+00004',
    'PC-3' = '+00005',
    'CORNER-CORRECTION' = '+00010'
}

export enum Aspect {
    'AUTO/VID AUTO/DEFAULT' = '0',
    'NORMAL(4:3)' = '1',
    'WIDE(16:9)' = '2',
    'NATIVE(through)' = '5',
    'FULL(HV FIT)' = '6',
    'H-FIT' = '9',
    'V-FIT' = '10'
}

export enum ColorMatching {
    OFF = '+00000',
    '3COLORS' = '+00001',
    '7COLORS' = '+00002',
    'MEASURED' = '+00004'
}

export enum ScreenSetting {
    '16:10' = '0',
    '16:9' = '1',
    '4:3' = '2'
}

export enum ShutterFade {
    '0.0s(OFF)' = '0.0',
    '0.5s' = '0.5',
    '1.0s' = '1.0',
    '1.5s' = '1.5',
    '2.0s' = '2.0',
    '2.5s' = '2.5',
    '3.0s' = '3.0',
    '3.5s' = '3.5',
    '4.0s' = '4.0',
    '5.0s' = '5.0',
    '7.0s' = '7.0',
    '10.0s' = '10.0'
}

export enum NoSignalShutOff {
    DISABLE = '00',
    '10min' = '10',
    '20min' = '20',
    '30min' = '30',
    '40min' = '40',
    '50min' = '50',
    '60min' = '60',
    '70min' = '70',
    '80min' = '80',
    '90min' = '90'
}

export enum LensMemory {
    'LENS MEMORY1' = '+00000',
    'LENS MEMORY2' = '+00001',
    'LENS MEMORY3' = '+00002',
    'LENS MEMORY4' = '+00003',
    'LENS MEMORY5' = '+00004',
    'LENS MEMORY6' = '+00005',
    'LENS MEMORY7' = '+00006',
    'LENS MEMORY8' = '+00007',
    'LENS MEMORY9' = '+00008',
    'LENS MEMORY10' = '+00009'
}

export enum LampControlStatus {
    'LAMP OFF' = '0',
    'In turning ON' = '1',
    'LAMP ON' = '2',
    'LAMP Cooling' = '3'
}

export enum LampStatus {
    'ALL OFF' = '0',
    'ALL ON' = '1',
    '1:ON, 4:ON' = '2',
    '2:ON, 3:ON' = '3',
    '1:ON, 2:ON, 3:ON' = '4',
    '1:ON, 2:ON, 4:ON' = '5',
    '1:ON, 3:ON, 4:ON' = '6',
    '2:ON, 3:ON, 4:ON' = '7',
    '1:ON' = '8',
    '2:ON' = '9',
    '3:ON' = '10',
    '4:ON' = '11'
}

export enum TestPattern {
    Off = '00',
    White = '01',
    Black = '02',
    Red = '22',
    Green = '23',
    Blue = '24',
    Cyan = '28',
    Magenta = '29',
    Yellow = '30',
    Window = '05',
    'Window (Inversion)' = '06',
    'Colorbars (Vertical)' = '08',
    'Colorbars (Horizontal)' = '51',
    '16:9 / 4:3' = '59',
    'Crosshatch (White)' = '07',
    'Crosshatch (Red)' = '70',
    'Crosshatch (Green)' = '71',
    'Crosshatch (Blue)' = '72',
    'Crosshatch (Cyan)' = '73',
    'Crosshatch (Magenta)' = '74',
    'Crosshatch (Yellow)' = '75',
    Flag = '03',
    'Flag (Inversion)' = '04',
    Lamp = '09',
    Convergence = '11',
    '10%-Luminance' = '25',
    '5%-Luminance' = '26',
    '3D-1' = '80',
    '3D-2' = '81',
    '3D-3' = '82',
    '3D-4' = '83'
}

export enum ActionSpeed {
    'SLOW+' = '+00000',
    'SLOW-' = '+00001',
    'NORMAL+' = '+00100',
    'NORMAL-' = '+00101',
    'FAST+' = '+00200',
    'FAST-' = '+00201'
}

export enum CustomMasking {
    OFF = '+00000',
    'PC-1' = '+00001',
    'PC-2' = '+00002',
    'PC-3' = '+00003'
}

export enum EdgeBlending {
    OFF = '+00000',
    ON = '+00001',
    USER = '+00002'
}

export enum CommandType {
    Ascii = 0,
    Binary = 1
}

export interface RgbValue {
    R: number
    G: number
    B: number
}

export enum DisplayGridLines {
    OFF = 'FFFFFF',
    White = 'FFFFFF',
    Black = '000000',
    Red = 'FF0000',
    Green = '00FF00',
    Blue = '0000FF',
    Cyan = '00FFFF',
    Magenta = 'FF00FF',
    Yellow = 'FFFF00'
}

export interface GridSettings {
    mode: DisplayGridLines
    verticalLines: number
    horizontalLines: number
}

export enum OperatingMode {
    NORMAL = '+00000',
    ECO = '+00001',
    SILENT = '+00002',
    'LONG LIFE1' = '+00011',
    'LONG LIFE2' = '+00012',
    'LONG LIFE3' = '+00013',
    USER1 = '+00101',
    USER2 = '+00102',
    USER3 = '+00103'
}
