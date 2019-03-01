import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cid } from './../models/cid';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Subscription, Observable } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CidService } from '../cid.service';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-excluir-cid',
  templateUrl: './excluir-cid.component.html',
  styleUrls: []
})
export class ExcluirCidComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public cid: Cid;
  public cidForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  private genericValidator: GenericValidator;
  public errors: any[] = [];

  public removerVisivel: boolean;
  public reativarVisivel: boolean;

  public cidId: "";
  public sub: Subscription;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  constructor(
    private cidService: CidService,
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
    this.cid = new Cid();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.cidForm = this.fb.group({
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
        this.cidId = params['id'];
        this.obterCid(this.cidId);
      });

    this.cidService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        error => this.errors);
  }

  obterCid(id: string) {
    this.cidService.obterCid(id)
      .subscribe(
        cid => this.preencherFormCid(cid),
        response => {
          if (response.status === 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormCid(cid: Cid): void {
    this.cid = cid;

    this.reativarVisivel = this.cid.excluido === 'S';
    this.removerVisivel = this.cid.excluido === 'N';
    this.cidForm.patchValue({
      id: this.cid.id,
      grupoEmpresaId: this.cid.grupoEmpresaId,
      empresaId: this.cid.empresaId,
      codigo: this.cid.codigo,
      sigla: this.cid.sigla,
      descricao: this.cid.descricao,
      excluido: this.cid.excluido
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerCid();
      } else {
        self.cancelar();
      }
    });
  }

  removerCid() {
    this.cidService.RemoverCid(this.cid)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Cid, Removido com Sucesso!');
            this.router.navigate(['cid/lista']);
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
    this.router.navigate(['cid/editar/' + this.cidId]);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.cidService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

}


