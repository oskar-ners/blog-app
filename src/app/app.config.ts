import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'blog-app-cfa4a',
        appId: '1:67150894048:web:b57127ef6fd9fa55fe5185',
        storageBucket: 'blog-app-cfa4a.appspot.com',
        apiKey: 'AIzaSyCniZnayY9UEkOcvsoR3MqsBQ_N7U-292s',
        authDomain: 'blog-app-cfa4a.firebaseapp.com',
        messagingSenderId: '67150894048',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
