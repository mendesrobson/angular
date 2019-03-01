import { Component, OnInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContaCorrenteCobranca, FiltroRemessa } from '../models/remessa';
import { RemessaService } from '../remessa.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable } from 'rxjs/Observable';
import { DateUtils } from '../../../utils/date.utils';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { ReportService } from '../../../utils/report.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-gerar-remessa',
  templateUrl: './gerar-remessa.component.html',
  styleUrls: [],
  providers: [DateUtils]
})
export class GerarRemessaComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public filtroRemessaForm: FormGroup;

  busy: Subscription;


  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  contasCorrenteCobranca: ContaCorrenteCobranca[];

  filtroRemessa: FiltroRemessa;

  public myDatePickerOptions = DateUtils.getMyDatePickerOptionsEnabled();

  displayMessage: { [key: string]: string } = {};

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];

  valorRadio: string = 'gerar';

  carregarTable: boolean = false;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;



  selectedEntities: any[];

  constructor(private fb: FormBuilder,
    private remessaService: RemessaService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private report: ReportService) {

    this.toastr.setRootViewContainerRef(vcr);
    this.validationMessages = {

      grupoEmpresaId: { 
        required: 'O Grupo Empresa é requerido.'
      },
      empresaId: {
        required: 'A Empresa é requerida.'
      },
      contaCorrenteCobrancaId: {
        required: 'A Conta Corrente Cobrança é requerida.'

      },
      dataProcessamentoInicial: {
        required: 'A Dt. Processamento Inicial é requerida.'

      },
      dataProcessamentoFinal: {
        required: 'A Dt. Processamento Final é requerida.'

      }

    };


    this.genericValidator = new GenericValidator(this.validationMessages);
    this.filtroRemessa = new FiltroRemessa();
  }


  ngOnInit(): void {
    this.filtroRemessaForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      contaCorrenteCobrancaId: ['', [Validators.required]],
      dataProcessamentoInicial: ['', [Validators.required]],
      dataProcessamentoFinal: ['', [Validators.required]]
    });


    this.remessaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.remessaService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

    this.remessaService.obterTodosContaCorrenteCobranca()
      .subscribe(contasCorrenteCobranca => {
        this.contasCorrenteCobranca = contasCorrenteCobranca
        //  console.log(this.contasCorrenteCobranca)
      },
        error => this.errors);

    this.data = [];

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.filtroRemessaForm);
    });

  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  gerarRemessas(): void {
    if (this.filtroRemessaForm.dirty && this.filtroRemessaForm.valid) { }
    let p = Object.assign({}, this.filtroRemessa, this.filtroRemessaForm.value);


    p.contaCorrenteCobrancaId = p.contaCorrenteCobrancaId.toString();
    p.empresaId = p.empresaId.toString();
    p.grupoEmpresaId = p.grupoEmpresaId.toString();

    this.busy = this.remessaService.gerarRemessas(p)
      .subscribe(result => {
        //  this.data = result;
        //  this.carregarTable = true;
        alert(result)



      })
  }

  setarValorFiltro(event: Event) {
    this.carregarTable = false;

    const valor = event.target as HTMLInputElement;

    this.valorRadio = valor.value;


  }

  filtrar(): void {
    console.log('valor no filtrar' + this.valorRadio)
    if (this.valorRadio == 'gerar')
      this.gerarRemessas()
    else
      this.consultarRemessas();
  }

  consultarRemessas(): void {
    this.carregarTable = false;
    if (this.filtroRemessaForm.dirty && this.filtroRemessaForm.valid) {
      let p = Object.assign({}, this.filtroRemessa, this.filtroRemessaForm.value);

      p.dataProcessamentoInicial = p.dataProcessamentoInicial.formatted;
      p.dataProcessamentoFinal = p.dataProcessamentoFinal.formatted;

      p.contaCorrenteCobrancaId = p.contaCorrenteCobrancaId.toString();
      p.empresaId = p.empresaId.toString();
      p.grupoEmpresaId = p.grupoEmpresaId.toString();

      this.busy = this.remessaService.consultarRemessas(p)
        .subscribe(result => {
          this.data = result;
          this.carregarTable = true;
        })
    }
  }
    gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "Remessa",id))
      this.toastr.error("Não Possui Informações");
  }
  gerarPDF(model: string) {
    this.report.pdfFile(model, "Remessa");
  }
}
