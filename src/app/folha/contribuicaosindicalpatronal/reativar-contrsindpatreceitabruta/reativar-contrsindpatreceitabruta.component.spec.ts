import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReativarContrsindpatreceitabrutaComponent } from './reativar-contrsindpatreceitabruta.component';

describe('ReativarContrsindpatreceitabrutaComponent', () => {
  let component: ReativarContrsindpatreceitabrutaComponent;
  let fixture: ComponentFixture<ReativarContrsindpatreceitabrutaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReativarContrsindpatreceitabrutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReativarContrsindpatreceitabrutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
