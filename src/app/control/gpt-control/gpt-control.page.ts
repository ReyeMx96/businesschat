import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { doc, Firestore, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { ModalEditActionComponent } from 'src/app/modals/modal-edit-action/modal-edit-action.component';

@Component({
  selector: 'app-gpt-control',
  templateUrl: './gpt-control.page.html',
  styleUrls: ['./gpt-control.page.scss'],
})
export class GptControlPage implements OnInit {
  prompt: string = '';
  promptGuardado:string = '';
  firestore: any =  getFirestore()
  constructor(private route: ActivatedRoute,private modalCtrl: ModalController) {
  }
  currentBusiness:any
//   async copiarEntrenamiento(origen: string, destino: string) {
//   try {
//     const refOrigen = doc(this.firestore, "iatrainning/" + origen);
//     const refDestino = doc(this.firestore, "iatrainning/" + destino);

//     const snap = await getDoc(refOrigen);

//     if (!snap.exists()) {
//       console.error("❌ El documento origen NO existe");
//       return;
//     }

//     const data = snap.data();

//     // Sobrescribimos el destino con TODO el contenido
//     await setDoc(refDestino, {
//       ...data,
//       updatedAt: new Date()
//     }, { merge: true });

//     console.log("✅ ENTRENAMIENTO COPIADO CORRECTAMENTE");
//     console.log("🔹 Origen:", origen);
//     console.log("🔹 Destino:", destino);

//   } catch (err) {
//     console.error("🔥 Error al copiar entrenamiento:", err);
//   }
// }
async eliminarAction(action: any) {
  const alert = document.createElement('ion-alert');
  alert.header = 'Eliminar Acción';
  alert.message = `¿Estás seguro que quieres eliminar la acción <strong>${action.name}</strong>?`;
  alert.buttons = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Eliminar',
      handler: async () => {
        // 1. Eliminar localmente
        this.textActions = this.textActions.filter((a:any) => a.name !== action.name);

        // 2. Guardar cambios en Firestore
        const ref = doc(this.firestore, 'iatrainning/' + this.currentBusiness);

        await setDoc(
          ref,
          {
            textActions: this.textActions,
            updatedAt: new Date()
          },
          { merge: true }
        );

        console.log(`🔥 Acción eliminada: ${action.name}`);
      }
    }
  ];

  document.body.appendChild(alert);
  await alert.present();
}

  ngOnInit(): void {
  

    //this.copiarEntrenamiento('5218333861194', '5218334460818');
     this.currentBusiness = this.route.snapshot.paramMap.get('id')!.toString();
    this.cargarPromptInicial();
   
   // this.rellenarEjemplos()
  //  this.rellenarAccionesConDescripcion()
  }
textBody: string = '';
textTop: string = '';
textActions:any
textActionsString : string = '';
promptFinal: string = '';
textActionsStringGuia : string = '';
textEjemplos :any
textEjemplosString :any
async cargarPromptInicial() {
  const ref = doc(this.firestore, 'iatrainning/' + this.currentBusiness);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  this.prompt = data['text'] || "";
  console.log("PROMPT INICIAL CARGADO");
  console.log(this.prompt);
  this.textTop = data['textTop'] || "";
  this.textBody = data['textBody'] || "";
  this.textActions = data['textActions'] || [];
  this.textEjemplos = data['textEjemplos'] || [];
  this.textEjemplosString = this.generarEjemplosTexto(this.textEjemplos);

  // Generamos la sección de texto para acciones:
  this.textActionsString = this.generarActionsTexto(this.textActions);
  this.textActionsStringGuia = this.generarActionsTextoGuia(this.textActions);

  // Reconstruimos el prompt completo solo para mostrarlo (opcional)
  this.promptFinal =
    this.textTop +
    this.textActionsString +
     this.textActionsStringGuia +
      this.textEjemplosString +
    this.textBody;

    console.log(this.promptFinal)
}
generarEjemplosTexto(ejemplos: any[]) {
  return `
EJEMPLOS (REFERENCIA, NO IMITAR TEXTUALMENTE):

${ejemplos
  .map(e => {
    return `Mensaje: "${e.mensaje}"
{
"action": "${e.action}",
"params": ${JSON.stringify(e.params, null, 2)}
}
`;
  })
  .join("\n")}
`;
}

async rellenarAccionesConDescripcion() {
  const firestore = getFirestore();

  const acciones = [
    {
      name: "consultar_estado_pedido",
      description: "Cliente pregunta por el estado, avance o estatus de un pedido."
    },
    {
      name: "iniciar_pedido",
      description: "Cuando el cliente quiere ordenar, comprar o pedir algo."
    },
    {
      name: "cancelar_pedido",
      description: "Cuando el cliente quiere anular o cancelar un pedido."
    },
    {
      name: "hablar_con_soporte",
      description: "Solicitud explícita de hablar con soporte o un agente."
    },
    {
      name: "queja",
      description: "Problemas, pedidos mal hechos, faltantes o errores."
    },
    {
      name: "promociones",
      description: "El usuario pregunta por descuentos o promociones."
    },
    {
      name: "servicio_a_domicilio",
      description: "Preguntas sobre si existe servicio a domicilio."
    },
    {
      name: "cotizar_evento",
      description: "Cualquier solicitud de cotización para eventos o grupos."
    },
    {
      name: "costo_a_domicilio",
      description: "Preguntas sobre el costo de envío a domicilio."
    },
    {
      name: "tiene_servicio",
      description: "Cuando el cliente pregunta si tienen servicio sin contexto."
    },
    {
      name: "costo_envio_informacion",
      description: "Cuando piden información o costo para enviar datos."
    },
    {
      name: "metodos_de_pago",
      description: "Preguntas sobre tarjetas, efectivo o formas de pago."
    },
    {
      name: "request_precio",
      description: "El cliente pide precio de un producto específico."
    },
    {
      name: "horarios_y_ubicaciones",
      description: "Preguntas sobre horarios, ubicación o si está abierto."
    },
    {
      name: "direcciones",
      description: "Solicitan direcciones específicas."
    },
    {
      name: "solicitud_desconocida",
      description: "Se usa cuando la intención del mensaje no se puede determinar."
    }
  ];

  const ref = doc(firestore, "iatrainning/" + this.currentBusiness);

  await setDoc(
    ref,
    {
      textActions: acciones,
      updatedAt: new Date()
    },
    { merge: true }
  );

  console.log("ACCIONES CON DESCRIPCIÓN SUBIDAS A FIRESTORE");
}
async rellenarEjemplos() {
  const firestore = getFirestore();

  const ejemplos = [
    {
      mensaje: "Quiero saber el estado de mi pedido 123",
      action: "consultar_estado_pedido",
      params: { pedido_id: "123" }
    },
    {
      mensaje: "Donde están ubicados? Está abierto?",
      action: "horarios_y_ubicaciones",
      params: {}
    },
    {
      mensaje: "Mi pedido llegó mal",
      action: "queja",
      params: { pedido_id: null }
    },
    {
      mensaje: "Quiero un trole grande",
      action: "request_precio",
      params: {
        productos: [
          {
            producto: "trole grande",
            precio: "57",
            idn: "172343627711",
            cantidad: 1
          }
        ]
      }
    }
  ];

  const ref = doc(firestore, "iatrainning/" + this.currentBusiness);

  await setDoc(
    ref,
    {
      textEjemplos: ejemplos,
      updatedAt: new Date()
    },
    { merge: true }
  );

  console.log("EJEMPLOS SUBIDOS A FIRESTORE");
}

async guardarPrompt() {
  const ref = doc(this.firestore, 'iatrainning/' + this.currentBusiness);

  const promptFinal =
    this.textTop +
    this.generarActionsTexto(this.textActions) +
    + 
    this.textActionsStringGuia + 
    this.textEjemplosString + 
    this.textBody;

  await setDoc(ref, {
    text: promptFinal,
    textTop: this.textTop,
    textActions: this.textActions,
    textBody: this.textBody,
    updatedAt: new Date()
  });

  console.log("PROMPT DIVIDIDO GUARDADO");
}
imprimirHTML(html: string) {
  const ventana = window.open('', '_blank', 'width=400,height=600');

  ventana!.document.write(`
    <html>
    <head>
      <style>
        @page { size: auto; margin: 0; }
        body { font-family: Arial; padding: 10px; }
        .titulo { font-size: 20px; font-weight: bold; }
        .linea { border-top: 1px dashed #000; margin: 10px 0; }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `);

  ventana!.document.close();
  ventana!.focus();
  ventana!.print();
}

async editarAction(action: any) {
  const modal = await this.modalCtrl.create({
    component: ModalEditActionComponent,
    componentProps: { action: { ...action } } // mandamos copia
  });

  await modal.present();

  const { data } = await modal.onWillDismiss();

  if (data && data.actionEditada) {

    // 1. Actualizar en memoria
    const index = this.textActions.findIndex((a: any) => a.name === action.name);
    this.textActions[index] = data.actionEditada;

    console.log("Acción editada:", this.textActions[index]);

    // 2. GUARDAR AUTOMÁTICAMENTE EN FIRESTORE
    const ref = doc(this.firestore, 'iatrainning/' + this.currentBusiness);

    await setDoc(
      ref,
      {
        textActions: this.textActions,
        updatedAt: new Date()
      },
      { merge: true }
    );
    setTimeout(() => {
      this.guardarPrompt()
    }, 2000);

    console.log("🔥 Acción guardada automáticamente en Firestore");
  }
}



generarActionsTextoGuia(actions: any[]) {
  return `
GUÍA DE INTERPRETACIÓN (NO COPIAR EN RESPUESTA):
${actions.map(a => `- ${a.name} → ${a.description}`).join("\n")}
`;
}
generarActionsTexto(actions: any[]) {
  return `
ACCIONES DISPONIBLES:
${actions.map(a => `${a.name}`).join("\n")}
`;
}
async agregarNuevaAction() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Nueva Acción';
  alert.inputs = [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Nombre de la acción (ej: consultar_estado_pedido)'
    },
    {
      name: 'description',
      type: 'text',
      placeholder: 'Descripción de la acción'
    }
  ];
  alert.buttons = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Agregar',
      handler: async (data) => {
        if (!data.name || !data.description) {
          console.log("Campos vacíos");
          return;
        }

        // Nuevo objeto acción
        const newAction = {
          name: data.name.trim(),
          description: data.description.trim()
        };

        // 1. Guardar localmente
        this.textActions.push(newAction);

        // 2. Guardar en Firestore
        const ref = doc(this.firestore, 'iatrainning/' + this.currentBusiness);

        await setDoc(
          ref,
          {
            textActions: this.textActions,
            updatedAt: new Date()
          },
          { merge: true }
        );

        console.log("🔥 Nueva acción añadida:", newAction);
      }
    }
  ];

  document.body.appendChild(alert);
  await alert.present();
}

//  iatrainning/5218333861194 de estooo ya tiene algo, entonces lo pasaremos a esta nueva referencia /iatrainning/5218334460818 
}