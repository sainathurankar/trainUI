/**
 * Domain models for the train-search API responses.
 *
 * These interfaces describe the shapes returned by the backend (and mirrored by
 * the bundled mock JSON in `src/assets/mockjson`). They are intentionally
 * forgiving — most fields are optional because the upstream API is not under
 * our control and payloads vary by route/train. The goal is compile-time safety
 * for the fields the UI actually reads, not an exhaustive contract.
 */

/** A single class/quota availability row for a train. */
export interface Availability {
  quota?: string;
  className?: string;
  classType?: string;
  status?: string;
  seats?: string;
  fare?: string | number;
  originalFare?: number | null;
  fareDifference?: number | null;
  lastUpdatedOn?: string;
  lastUpdatedOnRaw?: number;
  availablityDate?: string;
  availablityType?: string;
  reasonType?: string;
  wlType?: string;
  tg?: string;
  // Per-class boarding/dropping override (differs from train O-D).
  frmStnCode?: string;
  frmStnName?: string;
  frmStnDepartureTime?: string;
  frmStnDepartureDate?: string;
  toStnCode?: string;
  toStnName?: string;
  toStnArrivalTime?: string;
  toStnArrivalDate?: string;
  // Confirmation prediction fields (redBus).
  predictionPercentage?: number | null;
  racCnfPredictionPercentage?: number | null;
  lbPredictionPercentage?: number | null;
  lbPredictionData?: unknown;
}

/** A train in a search result. */
export interface Train {
  trainName?: string;
  trainNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  departureDate?: string;
  arrivalDate?: string;
  fromStation?: string;
  toStation?: string;
  fromStationCode?: string;
  toStationCode?: string;
  distance?: string;
  trainType?: string;
  boardingHaltTime?: string;
  droppingHaltTime?: string;
  availableClasses?: string[];
  availabilitiesList?: Availability[];
  isAlternate?: boolean;
  isFastest?: boolean;
  isPopular?: boolean;
  runningMon?: string;
  runningTue?: string;
  runningWed?: string;
  runningThu?: string;
  runningFri?: string;
  runningSat?: string;
  runningSun?: string;
}

/** A promotional offer shown on the results page. */
export interface Offer {
  type?: string;
  code?: string;
  text?: string;
  discountDisplayText?: string;
}

/** Top-level search response. */
export interface SearchResponse {
  errorCode?: string | null;
  detailedMsg?: string | null;
  response?: unknown;
  status?: { StatusCode?: number; StatusMsg?: string } | null;
  trainList?: string[];
  trains?: Train[];
  recommendation?: Train | null;
  recommendationTags?: string[];
  offers?: Offer[];
  compositeAvailability?: unknown;
}

/** A station suggestion from the autocomplete endpoint. */
export interface Station {
  stationName: string;
  stationCode: string;
  state?: string;
  region?: string;
  cityName?: string;
  rbStationId?: number;
  locationId?: number;
  rank?: number;
  search_tag?: string;
  alias1?: string;
  alias2?: string;
  alias3?: string;
}

/** Autocomplete endpoint response. */
export interface AutocompleteResponse {
  start?: number;
  numFoundExact?: boolean;
  numFound?: number;
  results: Station[];
}

/** API health/status response. */
export interface ApiStatus {
  status?: string;
}
