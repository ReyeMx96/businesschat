import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent  implements OnInit {
  @Input() item: any;
  @Input() type: string | undefined;
  @Input() subcategoria: boolean | undefined;
  @Input() edit: boolean | undefined;
  @Input() products: boolean | undefined;
  @Output() actionPerformed = new EventEmitter<any>();

  constructor(private popoverController: PopoverController) { 
    
  }

  ngOnInit() {
 
    setTimeout(() => {
      console.log(this.products)
    }, 3000);
    setTimeout(() => {
      console.log(this.subcategoria)
    }, 3000);
  }
  performAction(action: string) {
    console.log(`Acción: ${action} en el ${this.type}`, this.item);
    // Aquí puedes agregar la lógica para cada acción
    this.actionPerformed.emit({ action, item: this.item });

    // Cerrar el popover
    this.popoverController.dismiss({ action, item: this.item });
  }
}
