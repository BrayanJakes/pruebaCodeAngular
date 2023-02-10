import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from './app.service';

interface Country {
	name: string;
	flag: string;
	area: number;
	population: number;
}

const COUNTRIES: Country[] = [
	{
		name: 'Russia',
		flag: 'f/f3/Flag_of_Russia.svg',
		area: 17075200,
		population: 146989754,
	},
	{
		name: 'Canada',
		flag: 'c/cf/Flag_of_Canada.svg',
		area: 9976140,
		population: 36624199,
	},
	{
		name: 'United States',
		flag: 'a/a4/Flag_of_the_United_States.svg',
		area: 9629091,
		population: 324459463,
	},
	{
		name: 'China',
		flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
		area: 9596960,
		population: 1409517397,
	},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  countries = COUNTRIES;
  form: any;
  platos: any = [];
  option = '';
  plato: any = {};

  constructor(private modalService: NgbModal, private fb: FormBuilder, private appService: AppService) {}

  ngOnInit(): void {
    this.prepareForm();
    this.listarPlatos()
  }

  listarPlatos(){
    this.appService.listarPlatos().subscribe({
      next: (resp: any) => {
        console.log(resp.resultado);
        if(resp.resultado){
          this.platos = resp.resultado;
        }
      }
    })
  }

  prepareForm() {
    this.form = this.fb.group({
      color: [null, [Validators.required]],
      precio: [null, [Validators.required]],
      campos: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      fecha: [null, [Validators.required]],
      inicio_actividad: [null],
    });
  }

  open(content: any, option: string, platoEdit?: any) {
    this.option = option;
    if(platoEdit){
      this.plato = platoEdit;

      this.form.get('color').setValue(platoEdit.color);
      this.form.get('nombre').setValue(platoEdit.nombre);
      this.form.get('campos').setValue(platoEdit.campos);
      this.form.get('fecha').setValue(platoEdit.fecha);
      this.form.get('precio').setValue(platoEdit.precio);
    }
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
        const body = {
          color: this.form.get('color').value,
          precio: this.form.get('precio').value,
          campos: this.form.get('campos').value,
          nombre: this.form.get('nombre').value,
          fecha: `${this.form.get('fecha').value.day}-${this.form.get('fecha').value.month}-${this.form.get('fecha').value.year}`,
          inicio_actividad: Date.now()
        }

        if(this.option === 'Editar'){
          this.appService.actualizarPlatos(this.plato._id, body).subscribe({
            next: (resp: any) => {
              if(resp){
                this.listarPlatos()
              }
            }
          })
        }else{
          this.appService.postPlatos(body).subscribe({
            next: (resp: any) => {
              if(resp.ok){
                this.listarPlatos()
              }
            }
          }) 
        }
        
			},
			(reason) => {
				
			},
		);
	}

  deletePlatos(id: string){
    this.appService.deletePlatos(id).subscribe({
      next: (resp: any) => {
        if(resp){
          this.listarPlatos()
        }
      }
    })
  }
}
