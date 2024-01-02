import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '../../service/patient.service';
import { Patient } from '../../model/patient';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
})
export class PatientComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'dni',
    'actions',
  ];
  patients: MatTableDataSource<Patient>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private patientService: PatientService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.patientService.getPatientChange().subscribe((data) => {
      this.createTable(data);
    });

    this.patientService.getMessageChange().subscribe((data) => {
      this._snackBar.open(data, 'INFO', { duration: 2000 });
    });

    this.patientService.findAll().subscribe((data) => {
      this.createTable(data);
    });
  }

  createTable(data: Patient[]) {
    this.patients = new MatTableDataSource(data);
    this.patients.paginator = this.paginator;
    this.patients.sort = this.sort;
  }

  delete(idPatient: number) {
    this.patientService
      .delete(idPatient)
      .pipe(
        switchMap(() => {
          return this.patientService.findAll();
        })
      )
      .subscribe((data) => {
        this.patientService.setPatientChange(data);
        this.patientService.setMessageChange('DELETED!');
      });
  }

  applyFilter(e: any) {
    this.patients.filter = e.target.value.trim();
  }
}
