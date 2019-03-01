import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})

export class RedefinirSenhaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public usuario: Usuario;
  public usuarioForm: FormGroup;
  public usuarioId: string = "";

  displayMessage: { [key: string]: string } = {};

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      email: {
        required: 'A E-mail é requerida.',
        minlength: 'A E-mail precisa ter no mínimo 2 caracteres',
        maxlength: 'A E-mail precisa ter no máximo 50 caracteres'
      },
      senha: {
        required: 'A Senha é requerida.',
        minlength: 'A Senha precisa ter no mínimo 3 caracteres',
        maxlength: 'A Senha precisa ter no máximo 10 caracteres'
      },
      senhaConfirmacao: {
        required: 'A Senha Confirmação é requerida.',
        minlength: 'A Senha Confirmação precisa ter no mínimo 3 caracteres',
        maxlength: 'A Senha Confirmação precisa ter no máximo 10 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.usuario = new Usuario();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.usuarioForm = this.fb.group({
      id: 0,
      email: [{value: '', disabled: true}, [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)]],
      senha: [{value: '', disabled: false}, [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10)]],
      senhaConfirmacao: [{value: '', disabled: false}, [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10)]],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.usuarioId = params['id'];
        this.obterUsuario(this.usuarioId);
      });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.usuarioForm);
    });
  }

  obterUsuario(id: string) {
    this.usuarioService.obterUsuario(id)
      .subscribe(
        usuario => this.preencherFormUsuario(usuario),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormUsuario(usuario: Usuario): void {
    this.usuario = usuario;

    this.usuarioForm.patchValue({
      id: this.usuario.usuarioId,
      email: this.usuario.email,
      senha: null,
      senhaConfirmacao: null
    });
  }

  redefinirSenhaUsuario() {
    if (this.usuarioForm.dirty && this.usuarioForm.valid) {
      let p = Object.assign({}, this.usuario, this.usuarioForm.value);

      this.usuarioService.redefinirSenhaUsuario(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Senha do Usuário Redefinida com Sucesso');
            this.router.navigate(['usuario/editar/' + this.usuarioId]);
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
    this.router.navigate(['usuario/editar/' + this.usuarioId]);
  }
}
