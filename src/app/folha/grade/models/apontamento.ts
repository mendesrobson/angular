export class Apontamento {
    id?: number;
    text: string;
    startDate: Date | number | string;
    endDate: Date | number | string;
    description?: string;
    recurrenceRule?:string;
    allDay?: boolean;
    diaSemana?:IDiaSemana[]
}
export class Calendario {
    horarioInicio: Date | number | string;
    horarioFim: Date | number | string;
    intervaloInicio: Date | number | string;
    intervaloFim: Date | number | string;
    tipo: string[];
}
export interface IDiaSemana {
    id: number,
    dia: string
}