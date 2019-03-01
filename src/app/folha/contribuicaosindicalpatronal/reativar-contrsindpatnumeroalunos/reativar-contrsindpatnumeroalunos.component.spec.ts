import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReativarContrsindpatnumeroalunosComponent } from './reativar-contrsindpatnumeroalunos.component';

describe('ReativarContrsindpatnumeroalunosComponent', () => {
  let component: ReativarContrsindpatnumeroalunosComponent;
  let fixture: ComponentFixture<ReativarContrsindpatnumeroalunosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReativarContrsindpatnumeroalunosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReativarContrsindpatnumeroalunosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
