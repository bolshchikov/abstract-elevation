export type TFileIdentifier = string;
export type TFile = {
  id: TFileIdentifier;
  name: string;
  imports: TFileIdentifier[];
  exports: {
    id?: string;
    name?: string;
    members?: {
      id?: string;
      name?: string
    }[]
  }[]
};
export type TStaticDepsMap = Map<TFileIdentifier, TFile>;