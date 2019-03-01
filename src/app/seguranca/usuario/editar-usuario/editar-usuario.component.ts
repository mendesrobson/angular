import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../usuario.service';
import { UsuarioComponent } from '../usuario.component';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: []
})
export class EditarUsuarioComponent implements OnInit, AfterViewInit {
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
  public visualizaLista: boolean = false;

  private result = {};

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioComponent: UsuarioComponent) {

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.usuario = new Usuario();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.usuarioForm = this.fb.group({
      id: 0,
      primeiroNome: [{ value: '', disabled: true }, [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)]],
      ultimoNome: [{ value: '', disabled: true }, [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)]],
      email: [{ value: '', disabled: true }, [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)]],
      senha: [{ value: '', disabled: true }, [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10)]],
      senhaConfirmacao: [{ value: '', disabled: true }, [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10)]],
      usuarioNome: { value: '', disabled: true },
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
        usuario =>
          this.preencherFormUsuario(usuario),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        }

      );
  }

  preencherFormUsuario(usuario: Usuario): void {
    this.usuario = usuario;
    this.usuarioComponent.Usuario = this.usuario;

    this.usuarioForm.patchValue({
      id: this.usuario.usuarioId,
      primeiroNome: this.usuario.primeiroNome,
      ultimoNome: this.usuario.ultimoNome,
      email: this.usuario.email,
      senha: this.usuario.senha,
      senhaConfirmacao: this.usuario.senhaConfirmacao,
      usuarioNome: this.usuario.usuarioNome
    });

    this.visualizaLista = true;
  }

  editarUsuario() {
    let p = this.usuarioComponent.Usuario;

    this.usuarioService.editarPapeisUsuario(p)
      .subscribe(
        result => {
          this.swal.showSwalSuccess('Papeis Adicionado com Sucesso!');
          this.router.navigate(['usuario/lista']);
        },
        error => {
          console.error(error)
        })
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['usuario/lista']);
  }


  excluir(id) {
    this.router.navigate(['usuario/excluir/' + id]);
  }

  redefinirSenha(id) {
    this.router.navigate(['usuario/redefinir/' + id]);
  }

}
