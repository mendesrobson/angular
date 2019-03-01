import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';
import { Titulo, TituloDesconto } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
//import { ToastsManager } from 'ng2-toastr';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-lista-titulodesconto',
  templateUrl: './lista-titulodesconto.component.html',
  styleUrls: []
})
export class ListaTitulodescontoComponent implements OnInit, AfterViewInit {

  @Output() atualizaValorDesconto: EventEmitter<number> = new EventEmitter<number>();

  public tituloId = 0;

  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  showDialog = false;

  public desconto: TituloDesconto;
  public descontos: TituloDesconto[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  swal: SweetAlertAdviceService;

  constructor(public tituloService: TituloService,
    private router: Router,
    private route: ActivatedRoute,
    //private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private tituloComponent: TituloComponent) {

    //this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];

    //this.data = JSON.parse(localStorage.getItem("tituloDesconto"))
    this.data = this.tituloComponent.Titulo.tituloDesconto;
  }

  ngAfterViewInit(): void {
    // this.data = JSON.parse(localStorage.getItem("tituloDesconto"))
    this.data = this.tituloComponent.Titulo.tituloDesconto;
  }

  atualizaStorage() {
    // this.data = JSON.parse(localStorage.getItem("tituloDesconto"));
    this.data = this.tituloComponent.Titulo.tituloDesconto;
  }

  editarDesconto(tituloDesconto) {

    this.tituloComponent.TituloDesconto = tituloDesconto;
    //localStorage.setItem("tituloDescontoEdit", JSON.stringify(desconto));
    this.showModal('modalEditar');
  }

  cadastrarDesconto() {
    this.router.navigate(['titulo/adicionarDesconto']);
  }

  public showModal(modal: string): void {

    if (modal == 'modalEditar') {
      this.modalEditVisible = true;
      this.modalAddVisible = false;
    }
    else if (modal == 'modalAdicionar') {
      this.modalEditVisible = false;
      this.modalAddVisible = true;
    }

  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  public descontoGravado(msg) {
   // this.toastr.success(msg, 'Sucesso', '');
  }

  public descontoNaoGravado(msg) {
   // this.toastr.error(msg, 'Falha', '');
  }


  inativarTituloDesconto(tituloDesconto) {

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerTituloDesconto(tituloDesconto);
      }
      else {
      }
    });

  }

  removerTituloDesconto(tituloDesconto) {


    let valorDesconto = 0;
    let valorBruto = this.tituloComponent.Titulo.valorBruto;

    if (tituloDesconto.desconto.percentualValor == '$') {
      valorDesconto = tituloDesconto.valorDesconto;
    } else if (tituloDesconto.desconto.percentualValor == '%') {
      valorDesconto = (valorBruto * tituloDesconto.valorDesconto) / 100;
    }

    this.atualizaValorDesconto.emit(valorDesconto);

    if (this.tituloId > 0) {

      this.tituloService.removerTituloDesconto(tituloDesconto)
        .subscribe(
        result => {

          this.descontos = this.tituloComponent.Titulo.tituloDesconto;
          this.descontoGravado('Desconto removido com sucesso!')

          for (var i = 0; i < this.descontos.length; i++) {
            if (tituloDesconto.id == this.descontos[i].id) {
              this.descontos.splice(i, 1);
            }
          }

          this.data = this.descontos;

          this.tituloComponent.Titulo.tituloDesconto = this.descontos;
        },
        error => {
          this.errors;
        })
    }
    else {

      this.descontos = this.tituloComponent.Titulo.tituloDesconto;

      for (var i = 0; i < this.descontos.length; i++) {
        if (tituloDesconto.id == this.descontos[i].id) {
          this.descontos.splice(i, 1);
        }
      }

      this.data = this.descontos;

      this.tituloComponent.Titulo.tituloDesconto = this.descontos;
      
      this.descontoGravado('Desconto removido com sucesso!')
    }

  }


}
