//@flow
export type Unit = {
  name: string,
  code: string,
  symbol: string,
  magnitude: number
};

export type Currency = {
  name: string,
  family: string,
  units: Array<Unit>
};
