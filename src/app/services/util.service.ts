import { Injectable, Pipe } from '@angular/core';
import { DatePipe } from '../../../node_modules/@angular/common';


@Injectable()
export class UtilService  {

    public datePipe: DatePipe;

    constructor() {
        
        this.datePipe = new DatePipe("en-US");
    }

    public ToDate(date) : string {

        if (date != null) {
            let dateString: string = date.toString();
            let mes: number = parseInt(dateString.substring(8, 10));
            let dia: number = parseInt(dateString.substring(5, 7));
            let ano: number = parseInt(dateString.substring(0, 5));
            let data: Date = new Date(dia + "/" + mes + "/" + ano);
            return data.toISOString().substring(0, 10);
        }
        return "";
    }

    public ConvertDateExtensive(date): string{

        return this.datePipe.transform(date, 'dd/MM/yyyy');
    }

    // public InvertedToDate(date) : string{

    //     if(date != null)
    //     {
    //         let dateString: string = date.toString();
    //         let dia: number = parseInt(dateString.substring(0, 2));
    //         let mes: number = parseInt(dateString.substring(3, 5));
    //         let ano: number = parseInt(dateString.substring(6, 10));
    //         return (ano + '/' + mes + '/' + dia);

    //     }
    //     return ''
    // }

    public ToDateString(date): string {
        console.log("ToDateString UtilService");
        if (date != null) {
            let dateString: string = date.toString();
            let dia: string = (dateString.substring(8, 10));
            let mes: string = (dateString.substring(5, 7));
            let ano: string = (dateString.substring(0, 4));
            let data: string = dia + "/" + mes + "/" + ano;
            return data;
        }
        return "";
    }

    public ToMesAnoString(date) {
        console.log("ToMesAnoString UtilService");
        let dateString: string = date.toString();
        let mes: string = (dateString.substring(5, 7));
        let ano: string = (dateString.substring(0, 4));
        let data: string = mes + "/" + ano;
        return data;
    }

    public ToCurrencyString(numero) {
        console.log("ToCurrencyString UtilService");
        var valor = numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        return valor;
    }

    public ConverterArquivoParaString(event, callback) {
        console.log("ConverterArquivoParaString UtilService");
        var files = event.target.files;
        var file = files[0];

        if (files && file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var binaryString = btoa(reader.result.toString());
                callback(binaryString);
            };
            reader.readAsBinaryString(file);
        }
    }

    public ConverterConteudoArquivoParaString(event, callback) {
        console.log("ConverterConteudoArquivoParaString UtilService");
        var files = event.target.files;
        var file = files[0];

        if (files && file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var conteudoString =reader.result;
                callback(conteudoString);
            };
            reader.readAsText(file);
        }
    }

    public VisualizarArquivo(arquivoString, tipo) {
        console.log("VisualizarArquivo UtilService");
        var fileURL;
        var byteCharacters = atob(arquivoString);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        if (tipo.toUpperCase() == "PDF") {
            fileURL = URL.createObjectURL(new Blob([(byteArray)], { type: 'application/pdf' }));
        }
        else if (tipo.toUpperCase() == "IMAGEM") {
            fileURL = URL.createObjectURL(new Blob([(byteArray)], { type: "image/jpeg" }));
        }
        else if (tipo.toUpperCase() == "TXT") {
            fileURL = URL.createObjectURL(new Blob([(byteArray)], { type: "image/txt" }));
        }
        window.open(fileURL, "EPrescription");
    }
}