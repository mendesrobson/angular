import { Injectable } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { data } from './../table/smart-table/smart-data-table';


@Injectable()
export class ReportService {

  constructor() { }

  gerarExcel(dataJson, filename: string, id: string = ''): boolean {
    var data = [];
    var headers = [];

    if (dataJson == undefined)
      dataJson = document.getElementById(id);

    for (var i = 0; i < dataJson.rows[0].cells.length; i++) {
      headers[i] = dataJson.rows[0].cells[i].innerText
        .replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a')
        .replace(new RegExp('[ÉÈÊ]', 'gi'), 'e')
        .replace(new RegExp('[ÍÌÎ]', 'gi'), 'i')
        .replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o')
        .replace(new RegExp('[ÚÙÛ]', 'gi'), 'u')
        .replace(new RegExp('[Ç]', 'gi'), 'c');
    }

    for (var i = 1; i < dataJson.rows.length; i++) {
      var tableRow = dataJson.rows[i]; var rowData = {};
      for (var j = 0; j < tableRow.cells.length; j++) {
        if (headers[j] == 'Status' || headers[j] == "Debito/Credito") // incluir condicao de procurar por ultima coluna ao inves de procurar por nome
          rowData[headers[j]] = tableRow.cells[j].innerText
            .replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a')
            .replace(new RegExp('[ÉÈÊ]', 'gi'), 'e')
            .replace(new RegExp('[ÍÌÎ]', 'gi'), 'i')
            .replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o')
            .replace(new RegExp('[ÚÙÛ]', 'gi'), 'u')
            .replace(new RegExp('[Ç]', 'gi'), 'c');
        else
          rowData[headers[j]] = tableRow.cells[j].innerHTML
            .replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a')
            .replace(new RegExp('[ÉÈÊ]', 'gi'), 'e')
            .replace(new RegExp('[ÍÌÎ]', 'gi'), 'i')
            .replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o')
            .replace(new RegExp('[ÚÙÛ]', 'gi'), 'u')
            .replace(new RegExp('[Ç]', 'gi'), 'c');
      }
      data.push(rowData);
    }

    var options = {
      filename: filename,
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false,
      showTitle: false,
      title: 'Relatório - ' + filename,
      useBom: false,
      headers: headers,
      noDownload: false,
    };
    new Angular5Csv(data, filename, options);

    return true;
  }

  pdfFile(id: string, filename: string) {

    var doc = new jsPDF('l', 'pt');

    var res = doc.autoTableHtmlToJson(document.getElementById(id));

    var header = function (data) {
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      // doc.addImage(img, 'PNG', data.settings.margin.left, 20, 50, 50);
      doc.text("Relatório - " + filename, data.settings.margin.left, 60);
    };

    var options = {
      beforePageContent: header,
      margin: {
        top: 80
      },
      startY: doc.autoTableEndPosY() + 80
    };

    doc.autoTable(res.columns, res.data, options);

    doc.save(filename + ".pdf");
  }

  gerarExcelTreeTable(model, header, filename) {

    var data = [];

    var i = 0;

    for (; i < Object.keys(model).length; i++) {
      data.push(<HTMLTableElement>model[i].data);
    }

    var options = {
      filename: filename,
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false,
      showTitle: false,
      title: 'Relatório - ' + filename,
      useBom: false,
      headers: header,
      noDownload: false,
    };

    new Angular5Csv(data, filename, options);
  }
  gerarPDFTreeTable(model, filename) {

    var data = [];

    for (var i = 0; i < Object.keys(model).length; i++) {
      data.push(<HTMLTableElement>model[i].data);
    }

    var file = new Blob(data, { type: 'application/pdf' });
    //console.log(file);
    var url = window.URL;
    var fileURL = url.createObjectURL(file);
    window.open(fileURL);
  }
}
