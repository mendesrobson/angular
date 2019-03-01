import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Uf } from '../models/uf';
import { UfService } from '../uf.service';
import { Pais } from '../../../cadastros/pessoa/models/pessoa';

@Component({
  selector: 'app-excluir-uf',
  templateUrl: './excluir-uf.component.html',
  styleUrls: []
})
export class ExcluirUfComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  
    public removerVisivel: boolean = false;
    public reativarVisivel: boolean = false;
  
    public uf: Uf;
    public ufForm: FormGroup;
    public paises: Pais[];
    public ufId: string = "";
  
    displayMessage: { [key: string]: string } = {};
  
    public sub: Subscription;
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
    swal: SweetAlertAdviceService;
    public errors: any[] = [];
  
    private result = {};
  
    constructor(
      private ufService: UfService,
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
        paisId: {
          required: 'O País é requerido!'
        }
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.uf = new Uf();
      this.swal = new SweetAlertAdviceService();
    }
  
    ngOnInit() {
      this.ufForm = this.fb.group({
        codigo: ['', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]],
        sigla: ['', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10)]],
        descricao: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]], 
        paisId: [null, [Validators.required]]
      });

      this.ufService.obterTodosPaisEndereco()
      .subscribe(paises => {
        this.paises = paises
      },
        () => this.errors);
  
      this.sub = this.route.params.subscribe(
        params => {
          this.ufId = params['id'];
          this.obterUf(this.ufId);
        });
    }
  
    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
        var self = this;
        this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
          if (isConfirmed) {
            self.removerUf();
          }
          else {
            self.cancelar();
          }
        });
    }
  
    obterUf(id: string) {
      this.ufService.ObterUfPorId(id)
        .subscribe(
        uf => this.preencherFormUf(uf),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
    }
  
    preencherFormUf(uf: Uf): void {
      this.uf = uf;
  
      this.reativarVisivel = this.uf.excluido === 'S';
      this.removerVisivel = this.uf.excluido === 'N';
  
      this.ufForm.patchValue({
        codigo: this.uf.codigo,
        sigla: this.uf.sigla,
        descricao: this.uf.descricao,
        paisId: this.uf.paisId
      });
    }
    
    removerUf() {
      this.ufService.RemoverUf(this.uf)
        .subscribe(
        result => {
          this.swal.showSwalSuccess('Uf, Removida com Sucesso');
          this.router.navigate(['uf/lista']);
        },
        error => {
          console.error(error)
        });
    }
    
    cancelar() {
      this.router.navigate(['uf/editar/' + this.ufId]);
    }
  
  }
