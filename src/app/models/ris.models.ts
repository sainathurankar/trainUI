// Models for the redBus RIS (rail information services) features:
// PNR status, live running status, train schedule and coach position.
// Fields mirror the backend /ris/* passthrough of the redBus responses;
// only the fields the UI renders are typed (responses may carry more).

export interface PnrStatusResponse {
  // Present on an invalid/expired PNR (backend surfaces the upstream body).
  errorcode?: string;
  errormsg?: string;
  detailedmsg?: string;

  // Success shape (redBus PnrToolkit).
  pnr?: string;
  trainNumber?: string;
  trainName?: string;
  boardingPoint?: string;
  reservationUpto?: string;
  doj?: string;
  journeyClass?: string;
  chartPrepared?: boolean;
  passengers?: PnrPassenger[];
  [key: string]: unknown;
}

export interface PnrPassenger {
  passengerSerialNumber?: number;
  bookingStatus?: string;
  currentStatus?: string;
  coachPosition?: string;
  [key: string]: unknown;
}

export interface TrainScheduleResponse {
  TrainName?: string;
  TrainNo?: number;
  TrainNumberString?: string;
  TrainType?: string;
  Source?: string;
  Destination?: string;
  SourceCode?: string;
  DestinationCode?: string;
  DaysOfRun?: Record<string, boolean>;
  Classes?: string[];
  Schedule?: ScheduleStop[];
  TotalDuration?: number;
  TotalDistance?: string;
  TotalNumberOfStops?: number;
  DisclaimerMsg?: string;
  errorcode?: string;
  errormsg?: string;
}

export interface ScheduleStop {
  StationName?: string;
  StationCode?: string;
  StopNumber?: number;
  ArrivalTime?: string;
  DepartureTime?: string;
  HaltMinutes?: string;
  Day?: number;
  DistanceFromOrigin?: string;
  ExpectedPlatformNo?: string;
}

export interface LiveStatusResponse {
  trainNumber?: string;
  trainName?: string;
  consideredRunningDate?: string;
  currentlyAt?: string;
  currentlyAtCode?: string;
  upcomingStation?: string;
  upcomingStationCode?: string;
  totalLateMins?: number;
  runningStatus?: LiveRunningStatus;
  ltsLastUpdatedTime?: string;
  stations?: LiveStation[];
  disclaimerMsg?: string;
  errorcode?: string;
  errormsg?: string;
}

export interface LiveRunningStatus {
  header?: string;
  status?: string;
  runningStatusMessage?: string;
}

export interface LiveStation {
  stationName?: string;
  stationCode?: string;
  distanceFromOrigin?: string;
  platform?: string;
  scheduledArrivalTime?: string;
  arrivalTime?: string;
  scheduledDepartureTime?: string;
  departureTime?: string;
  dayCount?: number;
  delayArr?: number;
  delayDep?: number;
  isItQueriedStation?: boolean;
  hasArrived?: boolean;
  hasDeparted?: boolean;
}

export interface CoachPositionResponse {
  trainNumber?: string;
  trainName?: string;
  source?: string;
  destination?: string;
  queriedStation?: string;
  coachPosition?: string[];
  listOfStations?: { stationName?: string; stationCode?: string }[];
  errorcode?: string;
  errormsg?: string;
}

/** A train suggestion for the train-number autocomplete. */
export interface TrainSuggestion {
  trainNumber: string;
  trainName: string;
  from?: string;
  to?: string;
}

/** Train autocomplete response. */
export interface TrainSearchResponse {
  results: TrainSuggestion[];
}
