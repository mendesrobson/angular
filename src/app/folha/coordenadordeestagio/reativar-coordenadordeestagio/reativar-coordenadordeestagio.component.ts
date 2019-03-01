import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MaskService } from '../../../services/mask.service';
import { Observable } from 'rxjs/Observable';
import { CoordenadorDeEstagioService } from '../coordenadordeestagio.service';
import { Subscription } from 'rxjs/Subscription';
import { CoordenadorDeEstagio } from '../models/coordenadordeestagio';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-reativar-coordenadordeestagio',
  templateUrl: './reativar-coordenadordeestagio.component.html',
  styleUrls: []
})
export class ReativarCoordenadorDeEstagioComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public coordenadorDeEstagio: CoordenadorDeEstagio;
  public coordenadorDeEstagioForm: FormGroup;
  public coordenadorDeEstagioId: "";
  displayMessage: { [key: string]: string } = {};

  cpfMask = this._maskService.Cpf();

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private coordenadorDeEstagioService: CoordenadorDeEstagioService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _maskService: MaskService) { 

      this.validationMessages = {

        grupoEmpresaId:
        {
          required: 'Grupo requerido!'
        },
        empresaId: {
          required: 'Empresa requerida!'
        },
        cpf:{
          required: 'Cpf requerido!'
        },
        nome: {
          required: 'Nome requerido!',
          maxlength: 'O Nome deve ter no máximo 100 caracteres!'
        },
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.coordenadorDeEstagio = new CoordenadorDeEstagio();
      this.swal = new SweetAlertAdviceService();

    }

  ngOnInit() {

    this.coordenadorDeEstagioForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: [''],
      sigla: [''],
      cpf: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.coordenadorDeEstagioId = params['id'];
        this.obterCoordenadorDeEstagio(this.coordenadorDeEstagioId);
      });

    this.coordenadorDeEstagioService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarCoordenadorDeEstagio();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterCoordenadorDeEstagio(id: string) {
    this.coordenadorDeEstagioService.ObterCoordenadorDeEstagio(id)
      .subscribe(
        coordenadorDeEstagio => this.preencherFormCoordenadorDeEstagio(coordenadorDeEstagio),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormCoordenadorDeEstagio(coordenadorDeEstagio: CoordenadorDeEstagio): void {
    this.coordenadorDeEstagio = coordenadorDeEstagio;

    this.reativarVisivel = this.coordenadorDeEstagio.excluido === 'S';
    this.removerVisivel = this.coordenadorDeEstagio.excluido === 'N';

    this.coordenadorDeEstagioForm.patchValue({
      id: this.coordenadorDeEstagio.id,
      grupoEmpresaId: this.coordenadorDeEstagio.grupoEmpresaId,
      empresaId: this.coordenadorDeEstagio.empresaId,
      codigo: this.coordenadorDeEstagio.codigo,
      sigla: this.coordenadorDeEstagio.sigla,
      cpf: this.coordenadorDeEstagio.cpf,
      nome: this.coordenadorDeEstagio.nome,
      excluido: this.coordenadorDeEstagio.excluido
    });
  }

  reativarCoordenadorDeEstagio() {
    this.coordenadorDeEstagioService.reativarCoordenadorDeEstagio(this.coordenadorDeEstagio)
      .subscribe(
      result => {
        if (result) {
          this.swal.showSwalSuccess('Coordenador de Estágio reativado com sucesso!');
        } else {
          this.swal.showSwalErro('Ocorreu um erro ao Reativar!');
        }        
        this.router.navigate(['coordenadordeestagio/lista']);
      },
      error => {
        console.error(error)
      });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.coordenadorDeEstagioService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['coordenadordeestagio/editar/' + this.coordenadorDeEstagioId]);
  }

}
