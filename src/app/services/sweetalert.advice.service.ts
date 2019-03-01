import { Injectable } from "@angular/core";
import { SweetAlertService } from 'ng2-sweetalert2';

@Injectable()
export class SweetAlertAdviceService {

    swal: SweetAlertService;
    constructor() {
        this.swal = new SweetAlertService();
    }
    showSwalSuccess(texto) {
        this.swal.success(
            {
                title: "Confirma&ccedil&atildeo",
                text: texto,
                confirmButtonText: 'Ok',
            }
        ).then(function (success) {
        }, function () {
        });
    }

    showSwalErro(texto) {
        this.swal.error(
            {
                title: "Ops...",
                text: texto,
                confirmButtonText: 'Ok',
            }
        ).then(function (error) {
        }, function () {
        });
    }

    showSwalConfirm(texto, callback) {
        this.swal.success({
            title: 'Você tem certeza?',
            text: texto,
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true
        }).then(function () {
            callback(true);
          }, function (dismiss) {
            if (dismiss === 'cancel') {
              callback(false);
            }
          });
    }

    showSwalErrorCodigo(texto, callback){
        this.swal.error({
            title: 'Código já existe!',
            text: texto,
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
            confirmButtonClass: 'btn btn-success',
            buttonsStyling: true
        }).then(function(){
            callback(true);
        });
    }

    showSwalError(texto, callback) {

        this.swal.error({
            text: texto,
            confirmButtonText: 'Ok',
        }
        ).then(function (error) {
            callback(true)
        }, function () {
            
        });
    
    }
}