import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgenteCausadorAcidente } from '../models/agentecausadosacidente';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AgenteCausadorAcidenteService } from '../agentecausadoracidente.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-reativar-agentecausadoracidente',
  templateUrl: './reativar-agentecausadoracidente.component.html',
  styleUrls: []
})
export class ReativarAgentecausadoracidenteComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public agenteCausadorAcidente: AgenteCausadorAcidente;
  public agenteCausadorAcidenteForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  private genericValidator: GenericValidator;
  public errors: any[] = [];

  public removerVisivel: boolean;
  public reativarVisivel: boolean;

  public agenteCausadorAcidenteId: "";
  public sub: Subscription;


  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  constructor(
    private agenteCausadorAcidenteService: AgenteCausadorAcidenteService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.validationMessages = {
      codigo: {
          required: 'O Código é requerido.',
          minlength: 'O Código precisa ter no mínimo 2 caracteres',
          maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
          required: 'A Sigla é requerida.',
          minlength: 'A Sigla precisa ter no mínimo 2 caracteres',
          maxlength: 'A Sigla precisa ter no máximo 20 caracteres'
      },
      descricao: {
          required: 'A Descrição é requerida.',
          minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
          maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.agenteCausadorAcidente = new AgenteCausadorAcidente();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.agenteCausadorAcidenteForm = this.fb.group({
      id: 0,
      grupoEmpresaId: 0,
      empresaId: 0,
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.agenteCausadorAcidenteId = params['id'];
        this.obterAgenteCausadorAcidente(this.agenteCausadorAcidenteId);
      });

    this.agenteCausadorAcidenteService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        error => this.errors);
  }

  obterAgenteCausadorAcidente(id: string) {
    this.agenteCausadorAcidenteService.obterAgenteCausador(id)
      .subscribe(
        agenteCausadorAcidente => this.preencherFormAgenteCausadorAcidente(agenteCausadorAcidente),
        response => {
          if (response.status === 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormAgenteCausadorAcidente(agenteCausadorAcidente: AgenteCausadorAcidente): void {
    this.agenteCausadorAcidente = agenteCausadorAcidente;

    this.reativarVisivel = this.agenteCausadorAcidente.excluido === 'S';
    this.removerVisivel = this.agenteCausadorAcidente.excluido === 'N';
    this.agenteCausadorAcidenteForm.controls['codigo'].disable();

    this.agenteCausadorAcidenteForm.patchValue({
      id: this.agenteCausadorAcidente.id,
      grupoEmpresaId: this.agenteCausadorAcidente.grupoEmpresaId,
      empresaId: this.agenteCausadorAcidente.empresaId,
      codigo: this.agenteCausadorAcidente.codigo,
      sigla: this.agenteCausadorAcidente.sigla,
      descricao: this.agenteCausadorAcidente.descricao,
      excluido: this.agenteCausadorAcidente.excluido
    });

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarNaturezaLesao();
      } else {
        self.cancelar();
      }
    });
  }

  reativarNaturezaLesao() {
    this.agenteCausadorAcidenteService.ReativarAgenteCausador(this.agenteCausadorAcidente)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Agente Causador Acidente, Reativado com Sucesso!');
            this.router.navigate(['agentecausadoracidente/lista']);
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao gravar!');
          }
        },
        error => {
          console.error(error);
        });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['agentecausadoracidente/editar/' + this.agenteCausadorAcidenteId]);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.agenteCausadorAcidenteService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

}


