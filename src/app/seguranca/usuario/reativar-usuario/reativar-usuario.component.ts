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
  selector: 'app-reativar-usuario',
  templateUrl: './reativar-usuario.component.html',
  styleUrls: []
})
export class ReativarUsuarioComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

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
      primeiroNome: {
        required: 'O Primeiro Nome é requerido.',
        minlength: 'O Primeiro Nome precisa ter no mínimo 2 caracteres',
        maxlength: 'O Primeiro Nome precisa ter no máximo 100 caracteres'
      },
      ultimoNome: {
        required: 'O Último Nome é requerido.',
        minlength: 'O Último Nome precisa ter no mínimo 2 caracteres',
        maxlength: 'O Último Nome precisa ter no máximo 100 caracteres'
      },
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
      primeiroNome: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)]],
      ultimoNome: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)]],
      email: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)]],
      senha: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10)]],
      senhaConfirmacao: ['', [Validators.required,
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

      var self = this;
      this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
        if (isConfirmed) {
          self.reativarUsuario();
        }
        else {
          self.cancelar();
        }
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

    this.reativarVisivel = this.usuario.excluido === 'S';
    this.removerVisivel = this.usuario.excluido === 'N';

    this.usuarioForm.patchValue({
      id: this.usuario.usuarioId,
      primeiroNome: this.usuario.primeiroNome,
      ultimoNome: this.usuario.ultimoNome,
      email: this.usuario.email,
      senha: this.usuario.senha,
      senhaConfirmacao: this.usuario.senhaConfirmacao,
      excluido: this.usuario.excluido
    });
  }
  
  reativarUsuario() {
    
  }
  
  cancelar() {
    this.router.navigate(['usuario/editar/' + this.usuarioId]);
  }


}