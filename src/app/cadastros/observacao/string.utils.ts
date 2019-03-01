export class StringUtils {
    public static IsNullOrEmpty (val: string): boolean {
        if (val === undefined || val === null || val.trim() === '') {
            return true;
        }
        return false;
    };
}