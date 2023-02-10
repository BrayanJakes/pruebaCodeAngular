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


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  precioValido = false;
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
    this.plato = {}
    this.precioValido = false;
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

  changePrecio(): any{
    this.precioValido = false;
    if(this.form.get('precio').value < '9'){
      return this.precioValido = true;
    }
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
				this.plato = {}
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
