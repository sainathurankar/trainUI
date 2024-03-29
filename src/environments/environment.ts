// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mock: true,
  apiUrl: 'https://rail-way-api.onrender.com/api',
  // apiUrl: 'http://localhost:8080/api',
  redBusBookingLink: 'https://www.redbus.in/railways/travellerInfo',
  hdfcSmartBuyLink: 'https://offers.reward360.in/v1/train/checkout?searchTrainKey={key}'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
