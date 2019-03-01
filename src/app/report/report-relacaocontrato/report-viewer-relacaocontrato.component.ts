import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import CustomStore from 'devextreme/data/custom_store';
import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Report } from '../models/report';
import { environment } from '../../../environments/environment';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'report-viewer-relacaocontrato',
  templateUrl: './report-viewer-relacaocontrato.component.html',
  styleUrls: ['./report-viewer-relacaocontrato.component.css']
})
export class ReportViewerRelacaocontratoComponent implements OnInit {

  public filtroRelacaoContratoForm: FormGroup;
  public report: Report;

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  clientes: Cliente[];
  ordem: string[];
  diasVencimento: string[];

    dropdownList = [];
    gridDataSource: any;
    _gridBoxValue: string[] = [];

  @ViewChild('scripts') scripts: ElementRef;

  public errors: any[] = [];
  
  @ViewChild("control") control: ElementRef

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private reportService: ReportService,
    private utilService: UtilService) { 

        this.ordem = [
          "Código",
          "Nome do Cliente",
          "Emissão"
        ];

        this.diasVencimento = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
        
      }

  ngOnInit() {

        this.filtroRelacaoContratoForm = this.fb.group({
          empresaId: null,
          grupoEmpresaId: null,
          clienteId: [],
          inicioFaturamento: '',
          fimFaturamento: '',
          inicioContrato: '',
          fimContrato: '',
          diaVencimento: '',
          ordenarPor: 'Código'
        });

        this.reportService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas;
            },
                () => this.errors);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.reportService.obterTodosEmpresa(idGrupo)
        .subscribe(resultado => {
            this.empresas = resultado;
        },
            () => this.errors);

  }

  ConsultaSelectEmpresa(idEmpresa) {

      this.reportService.obterTodosClientePorEmpresa(idEmpresa)
          .subscribe(f => {
              this.clientes = f;
              this.clientes.forEach(el => {
                  this.dropdownList.push({ id: el.id, codigo: el.pessoa.codigo, cliente: el.pessoa.nome });
              });

              this.gridDataSource = this.makeAsyncDataSource(this.dropdownList);

          }, () => { });
  }

  gerarRelatorioRelacaoContrato()
  {
    let p = Object.assign({}, this.report, this.filtroRelacaoContratoForm.value);

    switch (p.ordenarPor) {
      default:
      case "Código": p.ordenarPor = "codigo"; break;
      case "Nome do Cliente": p.ordenarPor = "nome"; break;
      case "Emissão": p.ordenarPor = "emissao"; break;
    }
     
    //#region Tratamento Datas

    if(p.inicioFaturamento === undefined || p.inicioFaturamento === '' || p.inicioFaturamento === null)
        p.inicioFaturamento = '01011899';
    else
        p.inicioFaturamento = this.utilService.ConvertDateExtensive(p.inicioFaturamento).replace(/\//g, '');  
    
    if(p.fimFaturamento === undefined || p.fimFaturamento === '' || p.fimFaturamento === null)
        p.fimFaturamento = '27122999';
    else
        p.fimFaturamento = this.utilService.ConvertDateExtensive(new Date(p.fimFaturamento.getFullYear(), p.fimFaturamento.getMonth() + 1, 0)).replace(/\//g, '');
    
    if(p.inicioContrato === undefined || p.inicioContrato === '' || p.inicioContrato === null)
        p.inicioContrato = '01011899';
    else
        p.inicioContrato = this.utilService.ConvertDateExtensive(p.inicioContrato).replace(/\//g, ''); 
    
    if(p.fimContrato === undefined || p.fimContrato === '' || p.fimContrato === null)
        p.fimContrato = '27122999';
    else
        p.fimContrato = this.utilService.ConvertDateExtensive(new Date(p.fimContrato.getFullYear(), p.fimContrato.getMonth() + 1, 0)).replace(/\//g, '');
    
    //#endregion

      let itens = [];
      if (this._gridBoxValue.length > 0) {
          for (var i = 0; i < this._gridBoxValue.length; i++) {
              itens.push(this._gridBoxValue[i]);
          }
      }

      p.clienteId = itens;

    let param = null;
    param = this.reportService.EstruturarParamentrosDoRelatorio('RelacaoContrato?', p);
    
    this.renderer.destroy;
        ko.cleanNode(this.control.nativeElement);

        const reportUrl = param,
            host = `${environment.url_reportView}`,
            container = this.renderer.createElement("div");

        container.innerHTML = Html;
        this.renderer.appendChild(this.scripts.nativeElement, container);
        ko.applyBindings({
            reportUrl, // The URL of a report that is opened in the Document Viewer when the application starts.  
            requestOptions: { // Options for processing requests from the Web Document Viewer.  
                host, // URI of your backend project.  
                invokeAction: "/WebDocumentViewer/Invoke" // The URI path of the controller action that processes requests.  
            }
       }, this.control.nativeElement);
  }
    makeAsyncDataSource(clientes) {
        return new CustomStore({
            loadMode: "raw",
            key: "id",
            load: function () {
                return clientes;
            }
        });
    };

    get gridBoxValue(): string[] {
        return this._gridBoxValue;
    }

    set gridBoxValue(value: string[]) {
        this._gridBoxValue = value || [];
    }
}
