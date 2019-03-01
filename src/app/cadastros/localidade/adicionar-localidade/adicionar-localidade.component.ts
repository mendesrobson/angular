import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalidadeService } from '../localidade.service';
import { Localidade } from '../models/localidade';
import { ToastsManager } from 'ng2-toastr';
import { Uf } from '../../uf/models/uf'

@Component({
  selector: 'app-adicionar-localidade',
  templateUrl: './adicionar-localidade.component.html',
  styleUrls: []
})
export class AdicionarLocalidadeComponent  implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public _localidade: Localidade;
  public _localidadeForm: FormGroup;
  public sub: Subscription;

  public estadoCivilId: string = "";

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public ufs: Uf[];

  public errors: any[] = [];

  constructor(
    private localidadeService: LocalidadeService,
    private fb: FormBuilder, private router: Router,
    private toastr: ToastsManager,vcr: ViewContainerRef,
    private route: ActivatedRoute) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      codigoIbge: {
        maxlength: 'O Código precisa ter no máximo 6 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      ufId: {
        required: 'Unidade da Federação requerido!'
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this._localidade = new Localidade();
    this.swal = new SweetAlertAdviceService();
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this._localidadeForm);
    });

  }
  
  ngOnInit(): void {
    this._localidadeForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      sigla: [''],
      codigoIbge:['', [Validators.maxLength(6)]],
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      ufId: [null, Validators.required]
    });

    this.localidadeService.ObterTodosUf()
    .subscribe(ufs => {
      this.ufs = ufs
    },
      () => this.errors);
  }

  adicionarLocalidade() {
    console.log(this._localidadeForm.valid);
    if (this._localidadeForm.dirty && this._localidadeForm.valid) {
      let p = Object.assign({}, this._localidade, this._localidadeForm.value);

      this.localidadeService.AdicionarLocalidade(p)
          .subscribe(
          () => { 
            this.swal.showSwalSuccess('Localidade Adicionada com Sucesso!');
            this.router.navigate(['localidade']);
          },error =>  this.onError(error))
    }else{
      this.toastr.error("Preencha os campos obrigatórios","Ops!");
    }
  }
  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  } 

  cancelar() {
    this.router.navigate(['localidade']);
  }
}
