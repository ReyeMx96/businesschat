import { Component, NgZone, OnInit } from '@angular/core';
import { getDatabase, ref, child, get, Database } from 'firebase/database';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.page.html',
  styleUrls: ['./procesos.page.scss'],
})
export class ProcesosPage implements OnInit {

  pedidosUserArray: any[] = [];
  searchs1: string = '';
  pedidosUserArray2: any[] = [];
  searchs2: string = '';
  teamLocal: any;
  showValues: boolean = false;
  showValues2: boolean = false;
  teamVisita: any;
  typeMarket: string = 'GL';
  public values: number[] = [];
  values2: number[] = [];
  private db: Database;

  constructor(private zone: NgZone) {
    this.db = getDatabase();
  }

  ngOnInit() {}

  search() {
    this.getStats(this.searchs1);
    this.showValues = true;
  }

  search2() {
    this.getStats2(this.searchs2);
    this.showValues2 = true;
  }

  getText1(event: any) {
    this.searchs1 = event.target.value;
  }

  getText2(event: any) {
    this.searchs2 = event.target.value;
  }

  onMakeChangesMenu(event: any) {
    console.log(event.detail.value);
    this.typeMarket = event.detail.value;
    this.getStats(this.searchs1);
    this.getStats2(this.searchs2);
  }

  getStats(team: string) {
    this.values = [];
    this.teamLocal = team;

    const teamRef = ref(this.db, `BetBytes/Equipos/${team}`);
    get(teamRef).then((snapshot) => {
      const res = snapshot.val();
      const array: any[] = [];

      for (const i in res) {
        array.push(res[i]);
        if (array.length === 5) break;
      }

      this.zone.run(() => {
        this.pedidosUserArray = array.reverse();
        for (let i = 0; i < this.pedidosUserArray.length; i++) {
          console.log(this.pedidosUserArray[i]);
          this.pedidosUserArray[i]['ValorSelectedL'] = this.pedidosUserArray[i][this.typeMarket];
          this.pedidosUserArray[i]['ValorSelectedV'] = this.pedidosUserArray[i][this.typeMarket.replace('L', 'V')];

          if (this.teamLocal === this.pedidosUserArray[i]['TL']) {
            this.values.push(this.pedidosUserArray[i]['ValorSelectedL']);
          } else {
            this.values.push(this.pedidosUserArray[i]['ValorSelectedV']);
          }

          if (i === 5) break;
        }

        this.values = this.values.reverse();
      });
    });
  }

  getStats2(team: string) {
    this.values2 = [];
    this.teamVisita = team;

    const teamRef = ref(this.db, `BetBytes/Equipos/${team}`);
    get(teamRef).then((snapshot) => {
      const res = snapshot.val();
      const array: any[] = [];

      for (const i in res) {
        array.push(res[i]);
        if (array.length === 5) break;
      }

      this.zone.run(() => {
        this.pedidosUserArray2 = array.reverse();
        for (let i = 0; i < this.pedidosUserArray2.length; i++) {
          console.log(this.pedidosUserArray2[i]);
          this.pedidosUserArray2[i]['ValorSelectedL'] = this.pedidosUserArray2[i][this.typeMarket];
          this.pedidosUserArray2[i]['ValorSelectedV'] = this.pedidosUserArray2[i][this.typeMarket.replace('L', 'V')];

          if (this.teamVisita === this.pedidosUserArray2[i]['TL']) {
            this.values2.push(this.pedidosUserArray2[i]['ValorSelectedL']);
          } else {
            this.values2.push(this.pedidosUserArray2[i]['ValorSelectedV']);
          }

          if (i === 5) break;
        }

        this.values2 = this.values2.reverse();
      });

      console.log(this.pedidosUserArray2);
    });
  }
}
