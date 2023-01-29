export type TFileIdentifier = string;

export type TFile = {
  id: TFileIdentifier;
  name: string;
  imports: TFileIdentifier[];
  exports: {
    id: string;
    name?: string;
    apiPath?: string;
    members?: {
      id: string;
      name?: string
      method?: string
      apiPath?: string;
    }[]
  }[]
};

export type TStaticDepsMap = Map<TFileIdentifier, TFile>;

export type Config = {
  id: string;
  src: string,
  include?: string[],
  exclude?: string[],
};