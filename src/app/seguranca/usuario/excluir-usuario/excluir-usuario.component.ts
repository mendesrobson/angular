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
  selector: 'app-excluir-usuario',
  templateUrl: './excluir-usuario.component.html',
  styleUrls: []
})
export class ExcluirUsuarioComponent implements OnInit, AfterViewInit {
  [x: string]: any;
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

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.usuario = new Usuario();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.usuarioForm = this.fb.group({
      id: 0,
      primeiroNome: {value : '', disabled: true},
      ultimoNome:  {value : '', disabled: true},
      email:  {value : '', disabled: true},
      senha:  {value : '', disabled: true},
      senhaConfirmacao:  {value : '', disabled: true},
      usuarioNome:  {value : '', disabled: true}
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
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerUsuario();
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

    this.usuarioForm.patchValue({
      id: this.usuario.usuarioId,
      primeiroNome: this.usuario.primeiroNome,
      ultimoNome: this.usuario.ultimoNome,
      email: this.usuario.email,
      senha: this.usuario.senha,
      senhaConfirmacao: this.usuario.senhaConfirmacao,
      usuarioNome : this.usuario.usuarioNome
    });
  }
  
  removerUsuario() {
    this.usuarioService.excluirUsuario(this.usuarioId)
      .subscribe(
      result => {
        this.swal.showSwalSuccess('Usuário Excluído com Sucesso');
        this.router.navigate(['usuario/lista']);
      },
      error => {
        console.error(error)
      });
  }
  
  cancelar() {
    this.router.navigate(['usuario/editar/' + this.usuarioId]);
  }

}

