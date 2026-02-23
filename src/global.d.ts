// global.d.ts
declare global {
  interface Window {
    recaptchaVerifier: any; // Puedes especificar el tipo correcto si lo conoces.
    confirmationResult: any; // Puedes especificar el tipo correcto si lo conoces.
  }
  interface Window {
    AndroidApp: any; // Cambia `any` al tipo específico si lo conoces.
  }
}

export {}; // Esto asegura que el archivo sea tratado como un módulo
