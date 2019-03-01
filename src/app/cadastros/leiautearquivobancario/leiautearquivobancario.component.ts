import { Component } from '@angular/core';
import { LeiauteArquivoBancario, RegLeiauteArquivoBancario, IteRegLeiauteArquivoBancario } from './models/leiautearquivobancario';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class LeiauteArquivoBancarioComponent {

  public leiauteArquivoBancario: LeiauteArquivoBancario;
  public regLeiauteArquivoBancario: RegLeiauteArquivoBancario;
  public iteRegLeiauteArquivoBancario: IteRegLeiauteArquivoBancario;

  public constructor() {
    this.leiauteArquivoBancario = new LeiauteArquivoBancario();
    this.leiauteArquivoBancario.regLeiauteArquivoBancario = [];
   // this.regLeiauteArquivoBancario = new RegLeiauteArquivoBancario();
    this.iteRegLeiauteArquivoBancario = new IteRegLeiauteArquivoBancario();
  }

  set LeiauteArquivoBancario(leiauteArquivoBancario: LeiauteArquivoBancario) {
    this.leiauteArquivoBancario = leiauteArquivoBancario;
    // this.leiauteArquivoBancario.regLeiauteArquivoBancario = leiauteArquivoBancario.regLeiauteArquivoBancario
  }

  get LeiauteArquivoBancario(): LeiauteArquivoBancario {
    return this.leiauteArquivoBancario;

  }

  set RegLeiauteArquivoBancario(regLeiauteArquivoBancario: RegLeiauteArquivoBancario) {
    this.regLeiauteArquivoBancario = regLeiauteArquivoBancario;
  }

  set IteRegLeiauteArquivoBancario(iteRegLeiauteArquivoBancario : IteRegLeiauteArquivoBancario) {
    this.iteRegLeiauteArquivoBancario = iteRegLeiauteArquivoBancario;
  }

  get IteRegLeiauteArquivoBancario() : IteRegLeiauteArquivoBancario {
    return this.iteRegLeiauteArquivoBancario;
  }
}