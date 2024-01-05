import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './pages/patient/patient.component';
import { MedicComponent } from './pages/medic/medic.component';
import { PatientEditComponent } from './pages/patient/patient-edit/patient-edit.component';

const routes: Routes = [
  {
    path: 'pages/patient',
    component: PatientComponent,
    data: { breadcrumb: 'Patient' },
    children: [
      {
        path: 'new',
        component: PatientEditComponent,
        data: { breadcrumb: 'patient-new' },
      },
      {
        path: 'edit/:id',
        component: PatientEditComponent,
        data: { breadcrumb: 'patient-edit' },
      },
    ],
  },
  {
    path: 'pages/medic',
    component: MedicComponent,
    data: { breadcrumb: 'Medic' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
