import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { CboService } from '../cbo.service';
import { Cbo } from '../models/cbo';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

@Component({
  selector: 'app-editar-cbo',
  templateUrl: './editar-cbo.component.html',
  styleUrls: []
})

export class EditarCboComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public cbo: Cbo;
  public cboForm: FormGroup;
  public cboId: string = "";

  displayMessage: { [key: string]: string } = {};

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};

  constructor(
    private cboService: CboService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
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
    this.cbo = new Cbo();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.cboForm = this.fb.group({
      id: 0,
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



    this.sub = this.route.params.subscribe(
      params => {
        this.cboId = params['id'];
        this.obterCbo(this.cboId);
      });
      
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.cboForm);
    });
  }

  obterCbo(id: string) {
    this.cboService.obterCbo(id)
      .subscribe(
      cbo => this.preencherFormCbo(cbo),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormCbo(cbo: Cbo): void {
    this.cbo = cbo;

    this.reativarVisivel = this.cbo.excluido === 'S';
    this.removerVisivel = this.cbo.excluido === 'N';

    !this.removerVisivel ? this.cboForm.disable() : this.cboForm.enable();

    this.cboForm.patchValue({
      id: this.cbo.id,
      codigo: this.cbo.codigo,
      sigla: this.cbo.sigla,
      descricao: this.cbo.descricao,
      excluido: this.cbo.excluido  
    });
  }

  editarCbo() {
    if (this.cboForm.dirty && this.cboForm.valid) {
      let p = Object.assign({}, this.cbo, this.cboForm.value);

      this.cboService.atualizarCbo(p)
        .subscribe(
        result => {
          this.swal.showSwalSuccess('Cbo Atualizado com Sucesso');
          this.router.navigate(['cbo/lista']);
        },
        error => {
          console.error(error)
        })
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['cbo/lista']);
  }

  remover(id) {
    this.router.navigate(['cbo/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['cbo/reativar/' + id]);
  }

}

