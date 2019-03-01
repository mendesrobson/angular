export class Cargo {
    id: string;
    empresaId: number;
    grupoEmpresaId: number;
    codigo: string;
    sigla: string;
    descricao: string;
    cargoRegulamentado: string;
    cargoLiberal: string;
    horaAtividade: string;
    excluido: string;
    cargoCbo: CargoCbo[];
}

export class CargoCbo {
    id: string;
    cargoId: string;
    cboId: string;
    dataInicial: string;
    dataFinal: string;
    excluido: string;  
    cbo: Cbo;      
}

export class Cbo {
    id: string;
    descricao: string;        
}
