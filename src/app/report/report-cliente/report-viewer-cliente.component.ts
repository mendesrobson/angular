import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';

import { ReportService } from '../report.service';
import { Empresa, GrupoEmpresa, Cliente, Status, Report } from '../models/report';

@Component({
  selector: 'report-viewer-cliente',
  templateUrl: './report-viewer-cliente.component.html',
  styleUrls: ['./report-viewer-cliente.component.css']
})

export class ReportViewerClienteComponent implements OnInit {
  public filtroRelatorioClienteForm: FormGroup;
  public report: Report;

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  clientes: Cliente[];
  status: Status[];

  @ViewChild('scripts')
  scripts: ElementRef;

  public errors: any[] = [];

  @ViewChild("control")
  control: ElementRef

  constructor(private renderer: Renderer2,
    private fb: FormBuilder,
    private reportService: ReportService) { }

  ngOnInit() {

    this.filtroRelatorioClienteForm = this.fb.group({
      empresaId: '',
      grupoEmpresaId: '',
      clienteId: '',
      statusId: ''
    });

    this.reportService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);

    this.reportService.obterTodosCliente()
      .subscribe(clientes => {
        this.clientes = clientes;
      },
        () => this.errors);

    this.reportService.getStatus()
      .subscribe(status => {
        this.status = status;
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

  gerarRelatorioCliente() {
    let p = Object.assign({}, this.report, this.filtroRelatorioClienteForm.value);
    
    let paramStatus = '';
    let paramCliente = '';
    let paramGrupo = '';
    let paramEmpresa = '';
    let param = null;
    param = 'Clientes?';

    if ((p.statusId === null) || (p.statusId === undefined)) {
      paramStatus = 'Excluido=';
    }
    else
    {
      if (p.statusId == 'INT') {
        paramStatus = 'Excluido=S'; 
      }
      else if (p.statusId == 'ATV') {
        paramStatus = 'Excluido=N';
      }
    }

    if ((p.clienteId === null) || (p.clienteId === undefined)) {
      paramCliente = 'ClienteId=';
    }
    else
    {
      paramCliente = 'ClienteId='+p.clienteId;
    }

    if ((p.grupoEmpresaId === null) || (p.grupoEmpresaId === undefined)) {
      paramGrupo = 'GrupoId=';
    }
    else
    {
      paramGrupo = 'GrupoId='+p.grupoEmpresaId;
    }
 
    if ((p.empresaId === null) || (p.empresaId === undefined)) {
      paramEmpresa = 'EmpresaId=';
    }
    else
    {
      paramEmpresa = 'EmpresaId='+p.empresaId;
    }
    
    if (paramStatus !== '') {
      if (param == 'Clientes?') {
        param = param + paramStatus;
       }
      else 
        param = param +'&'+ paramStatus;
    }
    
    if (paramCliente !== '') {
      if (param == 'Clientes?') {
        param = param + paramCliente;
       }
      else 
        param = param +'&'+ paramCliente;
    }

    if (paramGrupo !== '') {
      if (param == 'Clientes?') {
        param = param + paramGrupo;
       }
      else 
        param = param +'&'+ paramGrupo;
    }

    if (paramEmpresa !== '') {
      if (param == 'Clientes?') {
        param = param + paramEmpresa;
       }
      else 
        param = param +'&'+paramEmpresa;
    }
     
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
}