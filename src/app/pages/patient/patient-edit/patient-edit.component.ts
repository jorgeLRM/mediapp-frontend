import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientService } from '../../../service/patient.service';
import { Patient } from '../../../model/patient';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrl: './patient-edit.component.css',
})
export class PatientEditComponent implements OnInit {
  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      idPatient: 0,
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.maxLength(8)]],
      address: '',
      phone: ['', [Validators.required, Validators.maxLength(9)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.patientService.findById(this.id).subscribe((data) => {
        this.form = this.formBuilder.group({
          idPatient: data.idPatient,
          firstName: [
            data.firstName,
            [Validators.required, Validators.minLength(3)],
          ],
          lastName: [
            data.lastName,
            [Validators.required, Validators.minLength(3)],
          ],
          dni: [data.dni, [Validators.required, Validators.maxLength(8)]],
          address: data.address,
          phone: [data.phone, [Validators.required, Validators.maxLength(9)]],
          email: [data.email, [Validators.required, Validators.email]],
        });
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    if (this.isEdit) {
      this.patientService.update(patient).subscribe((data) => {
        this.patientService.findAll().subscribe((data) => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('UPDATED!');
        });
      });
    } else {
      this.patientService
        .save(patient)
        .pipe(
          switchMap(() => {
            return this.patientService.findAll();
          })
        )
        .subscribe((data) => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/patient']);
  }

  get idPatient() {
    return this.form.get('idPatient');
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get dni() {
    return this.form.get('dni');
  }

  get address() {
    return this.form.get('address');
  }

  get phone() {
    return this.form.get('phone');
  }

  get email() {
    return this.form.get('email');
  }
}
