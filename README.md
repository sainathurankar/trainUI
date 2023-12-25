# TrainUI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build Docker Image

To build the Docker image, use the following command:

```bash
docker build -t train-booking-app:latest .
```

## Run Docker Container

To run the Docker container and expose the Spring Boot application on port 8080, use the following command:

```bash
docker run -p 80:80 train-booking-app:latest
```


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
