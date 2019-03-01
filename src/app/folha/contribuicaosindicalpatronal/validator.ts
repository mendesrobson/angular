import { AbstractControl } from "@angular/forms";

export function minValorValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
        const valorFinalValue = control.value;

        const valorInicialControl = control.root.get('receitaInicial'); // magic is this
        if (valorInicialControl) {
            const valorInicialValue = valorInicialControl.value;
            if (valorInicialValue > valorFinalValue) {
                return {
                    isError: true
                };
            }
        }
    }

    return null;
}