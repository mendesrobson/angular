import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { CargoService } from '../cargo.service';
import { Cargo } from '../models/cargo';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { CargoComponent } from '../cargo.component';



@Component({
  selector: 'app-excluir-cargo',
  templateUrl: './excluir-cargo.component.html',
  styleUrls: []
})
export class ExcluirCargoComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public cargo: Cargo;
  public cargoForm: FormGroup;
  public cargoId: string = "";

  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  carregaCargocbo = false;

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};

  constructor(
    private cargoService: CargoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cargoComponent: CargoComponent) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
        required: 'A Sigla é requerida.',
        minlength: 'A Sigla precisa ter no mínimo 2 caracteres',
        maxlength: 'A Sigla precisa ter no máximo 10 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },

    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.cargo = new Cargo();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.cargoForm = this.fb.group({
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(10)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      excluido: 'N'
    });

    this.cargoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.cargoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

    this.sub = this.route.params.subscribe(
      params => {
        this.cargoId = params['id'];
        this.obterCargo(this.cargoId);
      });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerCargo();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterCargo(id: string) {
    this.cargoService.obterCargo(id)
      .subscribe(
        cargo => this.preencherFormCargo(cargo),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormCargo(cargo: Cargo): void {
    this.cargoComponent.Cargo.cargoCbo = cargo.cargoCbo;
    this.cargo = cargo;

    this.reativarVisivel = this.cargo.excluido === 'S';
    this.removerVisivel = this.cargo.excluido === 'N';

    this.cargoForm.patchValue({
      id: this.cargo.id,
      grupoEmpresaId: this.cargo.grupoEmpresaId,
      empresaId: this.cargo.empresaId,
      codigo: this.cargo.codigo,
      sigla: this.cargo.sigla,
      descricao: this.cargo.descricao,
      excluido: this.cargo.excluido      
    });    

    this.carregaCargocbo = true;
  }

  removerCargo() {   
    this.cargoService.removerCargo(this.cargo)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Cargo Removido com Sucesso!');            
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Remover!');            
          }
          this.router.navigate(['cargo/lista']);
        },
        error => {
          console.error(error)
        });
  }

  cancelar() {
    this.router.navigate(['cargo/editar/' + this.cargoId]);
  }

}

