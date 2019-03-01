import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cid } from './../models/cid';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CidService } from '../cid.service';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-adicionar-cid',
  templateUrl: './adicionar-cid.component.html',
  styleUrls: []
})
export class AdicionarCidComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public cid: Cid;
  public cidForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  private genericValidator: GenericValidator;
  public errors: any[] = [];

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  constructor(
    private cidService: CidService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private router: Router
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

    this.cidService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        error => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.cidForm);
    });
  }

  adicionarCid() {
    if (this.cidForm.dirty && this.cidForm.valid) {

      const p = Object.assign({}, this.cid, this.cidForm.getRawValue());

      this.cidService.AdicionarCid(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Cid, Adicionado com Sucesso!');
              this.router.navigate(['cid/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          error => {
            console.error(error);
          });
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['cid/lista']);
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

