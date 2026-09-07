import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ResultComponent } from './components/result/result.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from  '@angular/common/http';
import { SearchComponent } from './components/search/search.component';
import { LoaderComponent } from './components/loader/loader.component';
import { TrainCardComponent } from './components/train-card/train-card.component';
import { AvailabilityCardComponent } from './components/availability-card/availability-card.component';
import { NextAvailabiltyComponent } from './components/next-availabilty/next-availabilty.component';
import { NextAvailabilityModalComponent } from './components/next-availability-modal/next-availability-modal.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { AvailabilitySparklineComponent } from './components/availability-sparkline/availability-sparkline.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        ResultComponent,
        HeaderComponent,
        FooterComponent,
        SearchComponent,
        LoaderComponent,
        TrainCardComponent,
        AvailabilityCardComponent,
        NextAvailabiltyComponent,
        NextAvailabilityModalComponent,
        ToastContainerComponent,
        AvailabilitySparklineComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      })
    ], providers: [provideHttpClient(withXhr(), withInterceptorsFromDi())] })
export class AppModule {}
