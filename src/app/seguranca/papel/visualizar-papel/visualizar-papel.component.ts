import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder } from '../../../../../node_modules/@angular/forms';
import { Papel } from '../models/papel';
import { Subscription, Observable } from '../../../../../node_modules/rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { PapelService } from '../papel.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-visualizar-papel',
  templateUrl: './visualizar-papel.component.html',
  styleUrls: []
})

export class VisualizarPapelComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public papel: Papel;
  public papelForm: FormGroup;
  public papelId: string = "";

  displayMessage: { [key: string]: string } = {};

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};

  constructor(
    private papelService: PapelService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.papel = new Papel();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.papelForm = this.fb.group({
      papelId: { value: '', disabled: true },
      nome: { value: '', disabled: true },
      nomeNormalizado: { value: '', disabled: true },
      seloConcorrencia: { value: '', disabled: true }
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.papelId = params['id'];
        this.obterPapel(this.papelId);
      });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.papelForm);
    });
  }

  obterPapel(id: string) {
    this.papelService.obterPapel(id)
      .subscribe(
        papel => this.preencherFormPapel(papel),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormPapel(papel: Papel): void {
    this.papel = papel;

    this.papelForm.patchValue({
      papelId: this.papel.papelId,
      nome: this.papel.nome,
      nomeNormalizado: this.papel.nomeNormalizado,
      seloConcorrencia: this.papel.seloConcorrencia
    });
  }

  cancelar() {
    this.router.navigate(['papel/lista']);
  }

  excluir(id) {
    this.router.navigate(['papel/excluir/' + id]);
  }

}

