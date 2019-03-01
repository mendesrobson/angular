import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { LancamentoService } from '../lancamento.service';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { Lancamento, Cliente, Evento, Contrato } from '../models/lancamento';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { DateUtils } from '../../../utils/date.utils';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-reativar-lancamento',
  templateUrl: './reativar-lancamento.component.html',
  styleUrls: []
})
export class ReativarLancamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public errors: any[] = [];
  public lancamento: Lancamento;
  public lancamentoForm: FormGroup;
  public sub: Subscription;
  swal: SweetAlertAdviceService;

  public lancamentoId: string = "";
  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();    

  clientes: Cliente[];
  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  eventos: Evento[];
  contratos: Contrato[];

  constructor(private lancamentoService: LancamentoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _utilService: UtilService) {

    this.lancamento = new Lancamento();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.lancamentoForm = this.fb.group({
      codigo: '',
      descricao: '',
      clienteId: '',
      eventoFaturamentoId: '',
      fixo: 'N',
      faturarContrato: 'N',
      geradoPeloContrato: 'N',
      contratoFaturamentoId: '',
      dataLancamento: DateUtils.setMyDatePickerDate(Date.now()),
      dataVencimento: '',
      dataEncerramento: '',
      quantidade: 1,
      percentual: '',
      valorUnitario: '',
      valorTotal: '',
      empresaId: '',
      grupoEmpresaId: '',
      aliquotaIRRF: 0,
      aliquotaISS: 0,
      aliquotaPIS: 0,
      aliquotaCOFINS: 0,
      aliquotaCSLL: 0
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.lancamentoId = params['id'];
        this.obterLancamento(this.lancamentoId);
      });

    this.lancamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    this.lancamentoService.obterTodosContrato()
      .subscribe(contratos => {
        this.contratos = contratos
        console.log('contratos')
        console.log(contratos)
      },
      error => this.errors);

  }

  ngAfterViewInit(): void {
    var self = this;
    this.swal.showSwalConfirm('Reativar', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarLancamento();
      }
      else {
        self.cancelar();
      }
    });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  obterLancamento(id: string) {
    this.lancamentoService.obterLancamentoPorId(id)
      .subscribe(
      Lancamento => this.preencherLancamentoForm(Lancamento),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherLancamentoForm(lancamento: Lancamento): void {
    this.lancamento = lancamento;

    this.lancamentoForm.controls['codigo'].disable();

    this.lancamento.fixo = lancamento.fixo;
    this.lancamento.faturarContrato = lancamento.faturarContrato;
    this.lancamento.geradoPeloContrato = lancamento.geradoPeloContrato;

    this.lancamentoForm.patchValue({
      id: lancamento.id,
      codigo: lancamento.codigo,
      descricao: lancamento.descricao,
      clienteId: lancamento.clienteId,
      eventoFaturamentoId: lancamento.eventoFaturamentoId,
      // fixo: lancamento.fixo,
      // faturarContrato: lancamento.faturarContrato,
      //  geradoPeloContrato: lancamento.geradoPeloContrato,
      contratoFaturamentoId: lancamento.contratoFaturamentoId,
      dataLancamento: this._utilService.ToDate(lancamento.dataLancamento),
      dataVencimento: this._utilService.ToDate(lancamento.dataVencimento),
      dataEncerramento: this._utilService.ToDate(lancamento.dataEncerramento),
      quantidade: lancamento.quantidade,
      percentual: lancamento.percentual,
      valorUnitario: lancamento.valorUnitario,
      valorTotal: lancamento.valorTotal,
      empresaId: lancamento.empresaId,
      grupoEmpresaId: lancamento.grupoEmpresaId,
      aliquotaIRRF: lancamento.aliquotaIRRF,
      aliquotaISS: lancamento.aliquotaISS,
      aliquotaPIS: lancamento.aliquotaPIS,
      aliquotaCOFINS: lancamento.aliquotaCOFINS,
      aliquotaCSLL: lancamento.aliquotaCSLL
    });
  }

  cancelar() {
    this.router.navigate(['lancamento/editar/' + this.lancamentoId]);
  }

  reativarLancamento() {
    this.lancamentoService.reativarLancamento(this.lancamentoId)
      .subscribe(
      result => {
        this.swal.showSwalSuccess('Lançamento reativado com sucesso!');
        this.router.navigate(['lancamento/lista']);
      },
      error => {
        error => this.errors;
      });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.lancamentoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  ConsultaCliente(idEmpresa) {
    this.clientes = [];
    this.lancamentoService.obterTodosCliente(idEmpresa)
      .subscribe(clientes => {
        this.clientes = clientes
      },
        () => this.errors);
  }

}
