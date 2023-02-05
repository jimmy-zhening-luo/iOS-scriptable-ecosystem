declare class ValidString {
    readonly raw: string;
    readonly cleaned: string;
    readonly value: null | string;
    constructor(text: string, { toLower, trim, trimLeading, trimTrailing, }: {
        toLower?: boolean;
        trim?: boolean;
        trimLeading?: string[];
        trimTrailing?: string[];
    }, { maxLength }: {
        maxLength?: number;
    }, ...allowedChars: Char.CharInput[]);
    get isValid(): boolean;
    get string(): string;
    toString(): string;
}
declare namespace ValidString {
    const _OneGram: typeof OneGram;
    const _OneCharString: typeof OneCharString;
    const _PositiveInteger: typeof PositiveInteger;
}
//# sourceMappingURL=ValidString.d.ts.map