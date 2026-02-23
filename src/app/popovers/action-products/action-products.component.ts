import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-action-products',
  templateUrl: './action-products.component.html',
  styleUrls: ['./action-products.component.scss'],
})
export class ActionProductsComponent  implements OnInit {
  @Input() item: any;
  @Input() type: string | undefined;
  @Input() subcategoria: boolean | undefined;
  @Input() edit: boolean | undefined;
  @Input() products: boolean | undefined;
  @Output() actionPerformed = new EventEmitter<any>();

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}
  performAction(action: string) {
    console.log(`Acción: ${action} en el ${this.type}`, this.item);
    // Aquí puedes agregar la lógica para cada acción
    this.actionPerformed.emit({ action, item: this.item });

    // Cerrar el popover
    this.popoverController.dismiss({ action, item: this.item });
  }
}
