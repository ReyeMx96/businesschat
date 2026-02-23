import { Component, HostListener, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActionSheetController, ModalController, ToastController } from "@ionic/angular";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";

@Component({
  selector: 'app-modal-tags',
  templateUrl: './modal-tags.component.html',
  styleUrls: ['./modal-tags.component.scss'],
})
export class ModalTagsComponent implements OnInit {
  phoneNumberAdmin:any = ""
  arrayNumbers: any[] = [];
  AccWppId: any = "";
  ph:any = "";
  arrayContactosCache: any[] = [];
  menuLength = 0;
  arrayContactosRes: any;
  uid: any = "";
  tipoRespuesta = '';
  arrayTags: any[] = [];

  constructor(
    private toastController: ToastController,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private modalController: ModalController,
    private zone: NgZone
  ) {}


  closeModal() {
    this.modalController.dismiss();
  }

  saveModal() {
    this.modalController.dismiss(this.tipoRespuesta);
  }

  ngOnInit() {
    const modalState = {
      modal: true,
      desc: 'fake state for our modal',
    };
    history.pushState(modalState, "null");

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.uid = user.uid;
        const db = getDatabase();
        const userRef = ref(db, `UsersBusinessChat/${this.uid}`);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const res = snapshot.val();
            const array = [];

            for (const i in res['Auth']) {
              array.push(res['Auth'][i]);
            }

            this.arrayNumbers = array;
            this.phoneNumberAdmin = res['SelectedPh'].toString();
            this.getTags();
          }
        } catch (error) {
          console.error('Error reading user data:', error);
        }
      } else {
        // User is signed out
      }
    });
  }

  async getTags() {
    const db = getDatabase();
    const tagsRef = ref(db, `ruta/${this.phoneNumberAdmin}/Tags`);

    try {
      const snapshot = await get(tagsRef);
      if (snapshot.exists()) {
        const res = snapshot.val();
        const array : any = [];

        for (const i in res) {
          array.push(res[i]);
        }

        this.zone.run(() => {
          this.arrayTags = array;
        });
      }
    } catch (error) {
      console.error('Error reading tags:', error);
    }
  }

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  }
}
