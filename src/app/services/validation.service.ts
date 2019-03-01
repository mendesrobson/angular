import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

    public Email(email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
        }
        return (false)
    }

    public NuloOuVazio(campo) {
        if (campo == null || campo == undefined || campo == "")
            return false;
        else
            return false;
    }
}