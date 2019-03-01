import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { FormControlName, FormBuilder, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { GradeService } from '../grade.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { Apontamento, Calendario, IDiaSemana } from '../models/apontamento';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-adicionar-gradehorario',
  templateUrl: './adicionar-gradehorario.component.html',
  styleUrls: ['./adicionar-gradehorario.component.css']
})
export class AdicionarGradehorarioComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  hrInicio = {hour: 8, minute: 0};
  hrFim = {hour: 22, minute: 0};
  intInicio = {hour: 0, minute: 0};
  intFim = {hour: 0, minute: 0};

  modalIsOpen: boolean = false;
  @Output() apontamentoData: Apontamento[];
  dataAtual: Date = new Date(2018, 6, 15);
  calendario: Calendario[];
  diasSemana: IDiaSemana[];

  calendarioForm: FormGroup
  private validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private gradeService: GradeService,
    private fb: FormBuilder,
    private router: Router,
    public toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);

    this.calendarioForm = this.fb.group({
      horarioInicio: '',
      horarioFim: '',
      intervaloInicio: '',
      intervaloFim: '',
      tipo: '',
      tipoIntervalo: '',
      dom: '',
      seg: '',
      ter: '',
      qua: '',
      qui: '',
      sex: '',
      sab: ''
    });

    this.diasSemana = [{ id: 15, dia: "Dom" }, { id: 16, dia: "Seg" }, { id: 17, dia: "Ter" }, { id: 18, dia: "Qua" },
    { id: 19, dia: "Qui" }, { id: 20, dia: "Sex" }, { id: 21, dia: "Sab" }];
  }

  ngOnInit() {
  }

  adicionarCalendario() {
    let p: Calendario = Object.assign({}, this.calendario, this.calendarioForm.getRawValue());
    //console.log(this.hrInicio);
    if(this.GerarAgenda(p)){
      this.modalIsOpen = false;
      this.toastr.success("Apontamento inserido com Sucesso!", "Sucesso");
    }else{
      	this.toastr.error("Erro ao inserir o apontamento", "Ops!");
    }
    
  }

  private openModal(open: boolean): void {
    this.modalIsOpen = open;
  }

  apontamentoRendered($event) {
    //   for (let i = 0; i < this.apontamentoData.length; i++) {
    //     if (this.apontamentoData[i].endDate.valueOf() == $event.targetedAppointmentData.endDate.valueOf()
    //      && this.apontamentoData[i].startDate.valueOf() == $event.targetedAppointmentData.startDate.valueOf()){
    //       this.toastr.error("O Apontamento já existe!, remova para salvar", "Ops!");
    //       break;
    //     }  
    //  }
  }
  GerarAgenda(p: Calendario): boolean {
    let id = 15;
    let validar:boolean = false;

    for (let i = 0; i < this.diasSemana.length; i++) {
      if (this.diasSemana[i][id] == true) {
        if ((this.hrInicio.hour != 0 && this.hrInicio.minute != 0) &&
            (this.hrFim.hour != 0 && this.hrFim.minute != 0)) {
          console.log(p.intervaloInicio);
          this.apontamentoData = this.gradeService.ObterApontamentos(p, this.diasSemana[i].id);
          validar = true;
        } else {
          console.log(p.intervaloInicio);
          this.apontamentoData = this.gradeService.ObterApontamentosInicioFim(p, this.diasSemana[i].id);
          validar = true;
        }
      }else{
        this.toastr.error("Selecione Um dia da Semana","Ops!");
        validar = false;
        break;
      }
      id++;
    }
    return validar;
  }

  private close() {
    this.modalIsOpen = false;
  }
  private ValidarApontamento(apontamentoAtual: Apontamento[], apontamentoNovo: Apontamento[]): boolean {
    let retorno: boolean = false;
    for (var posicao = 0; posicao < apontamentoAtual.length; posicao++) {
      if (apontamentoAtual[posicao].text == apontamentoNovo[posicao].text) {
        retorno = false;
        this.toastr.error("O Apontamento já existe,dele", "Ops!");
        break;
      } else {
        this.toastr.success("Apontamento inserido com Sucesso!", "Sucesso");
        retorno = true;
        this.apontamentoData = apontamentoNovo;
      }
    }
    return retorno;
  }
}