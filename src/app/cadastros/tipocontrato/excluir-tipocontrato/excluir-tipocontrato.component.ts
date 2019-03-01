import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { TipoContrato, Periodicidade, TipoReajuste, Indice, Mes, Indexador } from '../models/tipocontrato';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipoContratoService } from '../tipocontrato.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-excluir-tipocontrato',
  templateUrl: './excluir-tipocontrato.component.html',
  styleUrls: []
})
export class ExcluirTipoContratoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[]; 
  
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public periodicidades: Periodicidade[];
  public tipoReajustes: TipoReajuste[];
  public indices: Indice[];
  public meses: Mes[];
  public indexadores: Indexador[];
  swal: SweetAlertAdviceService;

  private sub: Subscription;
  public tipoContrato: TipoContrato;
  public tipoContratoId: string;
  public errors: any[] = [];
  public tipoContratoForm: FormGroup;
 
  constructor(
    private tipoContratoService: TipoContratoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.tipoContrato = new TipoContrato();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.tipoContratoForm = this.fb.group({
      codigo: '',
      sigla: '',
      descricao: '',
      proporcionalDataInicio: '',
      indexadorSigla: '',
      periodicidadeSigla: '',
      tipoReajusteSigla: '',
      mesBaseSigla:'',
      indiceId: '',
      empresaId: '',
      grupoEmpresaId: '' });

    this.sub = this.route.params.subscribe(
        params => {
          this.tipoContratoId = params['id'];
          this.obterTipoContrato(this.tipoContratoId);
        });  

    this.tipoContratoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    this.tipoContratoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
      error => this.errors);

    this.tipoContratoService.obterTodosIndice()
      .subscribe(indices => {
        this.indices = indices
      },
      error => this.errors);

    // this.tipoContratoService.getPeriodicidade()
    //   .subscribe(periodicidades => {
    //     this.periodicidades = periodicidades
    //   },
    //   error => this.errors);
    this.periodicidades = [{
      "id": "M",
      "valor": "Mensal"
    },
    {
      "id": "B",
      "valor": "Bimestral"
    },
    {
      "id": "T",
      "valor": "Trimestral"
    },
    {
      "id": "S",
      "valor": "Semestral"
    },
    {
      "id": "A",
      "valor": "Anual"
    }];

    // this.tipoContratoService.getTipoReajuste()
    //   .subscribe(tipoReajustes => {
    //     this.tipoReajustes = tipoReajustes
    //   },
    //   error => this.errors);
    this.tipoReajustes = [{
      "id": "M",
      "valor": "Mensal"
    },
    {
      "id": "B",
      "valor": "Bimestral"
    },
    {
      "id": "T",
      "valor": "Trimestral"
    },
    {
      "id": "S",
      "valor": "Semestral"
    },
    {
      "id": "A",
      "valor": "Anual"
    },
    {
      "id": "DT",
      "valor": "Data Base"
    }];

    // this.tipoContratoService.getMes()
    //   .subscribe(meses => {
    //     this.meses = meses
    //   },
    //   error => this.errors);
    this.meses = [{
      "id": "JAN",
      "valor": "Janeiro"
    },
    {
      "id": "FEV",
      "valor": "Fevereiro"
    },
    {
      "id": "MAR",
      "valor": "Março"
    },
    {
      "id": "ABR",
      "valor": "Abril"
    },
    {
      "id": "MAI",
      "valor": "Maio"
    },
    {
      "id": "JUN",
      "valor": "Junho"
    },
    {
      "id": "JUL",
      "valor": "Julho"
    },
    {
      "id": "AGO",
      "valor": "Agosto"
    },
    {
      "id": "SET",
      "valor": "Setembro"
    },
    {
      "id": "OUT",
      "valor": "Outubro"
    },
    {
      "id": "NOV",
      "valor": "Novembro"
    },
    {
      "id": "DEZ",
      "valor": "Dezembro"
    }];

    // this.tipoContratoService.getIndexador()
    //   .subscribe(indexadores => {
    //     this.indexadores = indexadores
    //   },
    //   error => this.errors);
    this.indexadores = [{
      "id": "IND",
      "valor": "Índice"
    },
    {
      "id": "MOE",
      "valor": "Moeda Corrente"
    }];
  }
  
  ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
      
      var self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
          self.removerTipoContrato();
          }
      else {
          self.cancelar();
        }});  
  }
  
  obterTipoContrato(id: string) {
      this.tipoContratoService.obterTipoContrato(id)
        .subscribe(            
          tipoContrato => this.preencherFormTipoContrato(tipoContrato),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
    }
  
  preencherFormTipoContrato(tipocontrato: TipoContrato): void {
      this.tipoContrato = tipocontrato;

      this.tipoContratoForm.controls['codigo'].disable();
  
      this.tipoContratoForm.patchValue({
        codigo : this.tipoContrato.codigo,
        sigla : this.tipoContrato.sigla,
        descricao : this.tipoContrato.descricao,
        proporcionalDataInicio : this.tipoContrato.proporcionalDataInicio,
        indexadorSigla : this.tipoContrato.indexadorSigla,
        periodicidadeSigla : this.tipoContrato.periodicidadeSigla,
        tipoReajusteSigla : this.tipoContrato.tipoReajusteSigla,
        mesBaseSigla : this.tipoContrato.mesBaseSigla,
        indiceId : this.tipoContrato.indiceId,
        empresaId : this.tipoContrato.empresaId,
        grupoEmpresaId : this.tipoContrato.grupoEmpresaId
      });
    }
  
  cancelar(){
      this.router.navigate(['tipocontrato/editar/'+ this.tipoContratoId]);
    }
  
    removerTipoContrato() {
      this.tipoContratoService.removerTipoContrato(this.tipoContrato)
      .subscribe(
      result => { 
        this.swal.showSwalSuccess('Tipo Contrato Removido com Sucesso');
        this.router.navigate(['tipocontrato/lista']);
      },
      error => { 
        error => this.errors;
      });
    }
  }    