import { Component, OnInit, Output, EventEmitter, Input, ViewContainerRef } from '@angular/core';
import { CentroCusto, TituloCentro } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
//import { ToastsManager } from 'ng2-toastr';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-lista-titulocentrocusto',
  templateUrl: './lista-titulocentrocusto.component.html',
  styleUrls: []
})
export class ListaTitulocentrocustoComponent implements OnInit {

  @Input() permitirEditar: boolean;
  public tituloId = 0;

  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;
  showDialog = false;

  public tituloCentro: TituloCentro;
  public tituloCentros: TituloCentro[];

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

   // this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];

    //   this.data = JSON.parse(localStorage.getItem("tituloCentroCusto"))
    if (this.tituloComponent.Titulo.tituloCentro != null && this.tituloComponent.Titulo.tituloCentro.length > 0)
      this.data = this.tituloComponent.Titulo.tituloCentro.filter(c => c.centroCusto != null);

    ///  this.atualizaStorage()
  }

  ngAfterViewInit(): void {
    //this.data = JSON.parse(localStorage.getItem("tituloCentroCusto"))
    //  this.data = this.tituloComponent.Titulo.tituloCentro;
  }

  atualizaStorage() {
  
    // this.data = JSON.parse(localStorage.getItem("tituloDesconto"));

    //if (this.tituloComponent.Titulo.tituloCentro.length > 0)
    if (this.tituloComponent.Titulo.tituloCentro.length > 0)
      this.data = this.tituloComponent.Titulo.tituloCentro.filter(c => c.centroCusto != null);

    //   if (this.tituloService.validarPercentual(this.data) == false)
    //   {
    //     this.centroCustoErro('Não é possível ter mais de 100% de Centro de Custo')

    //   }
  }

  editarCentroCusto(tituloCentro) {
    // localStorage.setItem("tituloCentroCustoEdit", JSON.stringify(tituloCentro));
    this.tituloComponent.TituloCentro = tituloCentro;

    this.showModal('modalEditar');
  }

  cadastrarCentroCusto() {
    this.router.navigate(['titulo/adicionarCentroCusto']);
  }

  public showModal(modal: string): void {

    if (this.permitirEditar == false) {
      this.centroCustoErro('Não é permitido incluir Centro de Custo com parcelas não abertas')
    }

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

  public centroCustoGravado(msg) {

    //this.toastr.success(msg, 'Sucesso', '');
  }

  public centroCustoErro(msg) {

    //this.toastr.error(msg, 'Falha', '');
  }



  inativarCentroCusto(tituloCentro) {
    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerTituloCentro(tituloCentro);
      }
      else {
      }
    });
  }

  removerTituloCentro(tituloCentro) {
    if (this.tituloId > 0) {
      this.tituloService.excluirTituloCentro(tituloCentro.id.toString())
        .subscribe(
        result => {
          this.tituloCentros = this.tituloComponent.Titulo.tituloCentro;
          for (var i = 0; i < this.tituloCentros.length; i++) {
            if (tituloCentro.id == this.tituloCentros[i].id) {
              this.tituloCentros.splice(i, 1);
            }
          }
          this.data = this.tituloCentros;
          this.tituloComponent.Titulo.tituloCentro = this.tituloCentros;



          this.tituloService.gerarApropriacaoCentroAngular(this.tituloComponent.titulo)
            .subscribe(
            result => {

              for (var i = 0; i < this.tituloComponent.titulo.parcela.length; i++) {
                this.tituloComponent.titulo.parcela[i].apropriacaoCentro = result;

              }

              this.centroCustoGravado('Centro Custo, removido com sucesso!');

            }
            )



          //    this.atualizaStorage();
          // localStorage.setItem("tituloCentroCusto", JSON.stringify(this.tituloCentros));
        },
        error => {
          this.errors;
        })
    }
    else {
      this.tituloCentros = this.tituloComponent.Titulo.tituloCentro;

      for (var i = 0; i < this.tituloCentros.length; i++) {
        if (tituloCentro.id == this.tituloCentros[i].id) {
          this.tituloCentros.splice(i, 1);
        }
      }

      this.data = this.tituloCentros;
      this.tituloComponent.Titulo.tituloCentro = this.tituloCentros;
      //  this.atualizaStorage();

      //  localStorage.setItem("tituloCentroCusto", JSON.stringify(this.tituloCentros));
      this.centroCustoGravado('Centro Custo, removido com sucesso!')
    }

  }

}

