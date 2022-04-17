export interface NewAticle {
  id?: number;
  tags: string[];
  content: string;
}
export type tagType = {
  name: string;
  id: string;
  active?: boolean;
};
export interface Article {
  id: number;
  tags: tagType[];
  content: string;
  time: string;
  link: string;
}
