export type ServiceImage = {
  id: string;
  url: string;
  isMain: boolean;
};

export type Service = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  images: ServiceImage[];
};

export type ServiceInput = {
  name: string;
  durationMin: number;
  price: number;
};
