import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.scss'],
})
export class ModalCreateComponent  implements OnInit {
 @Input() editingProduct: any = null;

  productForm: FormGroup;
  saving = false;
  selectedFile: File | null = null;
  firestore = getFirestore();
  storage = getStorage();
  defaultImage = 'https://via.placeholder.com/250x250.png?text=No+Image';

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      stock: [0, Validators.required],
      unitType: ['UNIDAD', Validators.required],
      description: [''],
      category: [''],
      alertStock: [0],
      expiryDate: [''],
      sku: [''],
      supplier: [''],
      brand: [''],
      purchasePrice: [0],
      storageLocation: [''],
    });
  }

  ngOnInit() {
    if (this.editingProduct) {
      this.productForm.patchValue(this.editingProduct);
    }
  }

  onFileChange(ev: any) {
    const file = ev.target.files?.[0];
    this.selectedFile = file || null;
  }

  async saveProduct() {
    if (this.productForm.invalid) return;
    this.saving = true;
    const data = this.productForm.value;

    try {
      let imageUrl = this.editingProduct?.imageUrl || this.defaultImage;
      if (this.selectedFile) {
        const filePath = `products/${Date.now()}_${this.selectedFile.name}`;
        const storageRef = ref(this.storage, filePath);
        const snapshot = await uploadBytes(storageRef, this.selectedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const payload = {
        ...data,
        imageUrl,
        createdAt: this.editingProduct?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (this.editingProduct?.id) {
        await updateDoc(doc(this.firestore, 'products', this.editingProduct.id), payload);
      } else {
        await addDoc(collection(this.firestore, 'products'), payload);
      }

      this.modalCtrl.dismiss(payload, 'saved');
    } catch (err) {
      console.error(err);
      alert('Error al guardar producto');
    } finally {
      this.saving = false;
    }
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}