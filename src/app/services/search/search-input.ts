export interface SearchInput {
  src: string;
  dst: string;
  doj: string;
}

export interface TrainUpdateInput {
  source: string;
  destination: string;
  doj: string;
  quota: string;
  trainNumber: string;
  class: string;
  numberOfDays?: number
}
