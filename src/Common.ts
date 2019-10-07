
export function enumValueToLabel (list: any, value: string): string | undefined {
    for (const label in list) {
        if (list[label] === value) {
            return label
        }
    }

    return undefined
}
