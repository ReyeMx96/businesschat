import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-tags-restaurante',
  templateUrl: './modal-tags-restaurante.component.html',
  styleUrls: ['./modal-tags-restaurante.component.scss'],
})
export class ModalTagsRestauranteComponent  implements OnInit {
 @Input() existingTags: string[] = []; // Array recibido con etiquetas a deshabilitar
  tags: { name: string; disabled: boolean }[] = []; // Lista de etiquetas con estado

  constructor(
    private firestore: AngularFirestore,
    private modalctrl: ModalController
  ) {}

  ngOnInit() {
    this.getTags();
  }

  getTags() {
    this.firestore
      .doc<{ tags: string[] }>('tags/general')
      .valueChanges()
      .subscribe((data) => {
        const fetchedTags = data?.tags || [];
        this.tags = fetchedTags.map((tag) => ({
          name: tag,
          disabled: this.existingTags.includes(tag), // Marca como deshabilitado si coincide
        }));
      });
  }

  select(item: { name: string; disabled: boolean }) {
    if (!item.disabled) {
      this.modalctrl.dismiss(item.name); // Devuelve solo el nombre si no está deshabilitado
    }
  }
}
