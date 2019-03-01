import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirContrsindpatreceitabrutaComponent } from './excluir-contrsindpatreceitabruta.component';

describe('ExcluirContrsindpatreceitabrutaComponent', () => {
  let component: ExcluirContrsindpatreceitabrutaComponent;
  let fixture: ComponentFixture<ExcluirContrsindpatreceitabrutaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcluirContrsindpatreceitabrutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcluirContrsindpatreceitabrutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
