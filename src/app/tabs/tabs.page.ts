import { Component, NgZone, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, onValue, ref } from 'firebase/database';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

 auth = getAuth();
db = getDatabase();
  arrayCart: any = []
  uid:any
  id = ""
  phoneUser : any
  constructor(private zone : NgZone) { 

  }


// Reemplazo de ngOnInit
businessFinal = ""
phoneNumberAdmin = ""
sucursales:any = []
ngOnInit() {
  onAuthStateChanged(this.auth, (user) => {
    if (user) {
      const uid = user.uid;
      this.uid = uid;
      this.getUsers(this.uid);
      const db = getDatabase();
      const businessRef = ref(db, `UsersBusinessChat/${uid}`);
      onValue(businessRef, (snapshot) => {
        const res = snapshot.val();
        const array = [];

        for (const i in res) {
          array.push(res[i]);
        }

        this.businessFinal = res['SelectedPh'] || "";
        this.phoneNumberAdmin = res['SelectedPh'] || "";
        const businessRef = ref(db, `ruta/${this.businessFinal}/Sucursales`);
        onValue(businessRef, (snapshot) => {
          const res = snapshot.val();
          const array = [];

          for (const key in res) {
            array.push({
              id: key,          // 👈 ESTA ES LA KEY (el id de cada sucursal)
              ...res[key]       // 👈 Los datos internos
            });
          }

          this.sucursales = array;
          this.businessFinal = this.sucursales[0]?.id || "";
        });


      });
    } else {
      setTimeout(() => {
        this.getCart(localStorage.getItem('typeCart'));
      }, 1500);
    }
  });
}

getUsers(uid: string) {
  const userRef = ref(this.db, `Users/${uid}`);
  onValue(userRef, (snapshot) => {
    const res = snapshot.val();
    // this.phoneUser = res.Phone;
    // this.getCart(this.phoneUser);
  });
}

getCart(type: string | null) {
  if (!type) return;
  
  const cartRef = ref(this.db, `CartWpp/${type}`);
  onValue(cartRef, (snapshot) => {
    const res = snapshot.val();
    const array: any[] = [];

    if (res !== null) {
      for (const i in res) {
        array.push(res[i]);
      }
      this.zone.run(() => {
        this.arrayCart = array;
      });
    } else {
      this.arrayCart = array;
    }
  });
}

}


