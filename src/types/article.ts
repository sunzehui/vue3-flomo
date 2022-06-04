export interface NewAticle {
  id?: number;
  tags: string[];
  content: string;
}
export type tagType = {
  name: string;
  id: string;
  active?: boolean;
  is_topics?: boolean;
  content: string;
};
export interface Article {
  id: string;
  tags: tagType[];
  content: string;
  updateTime: string;
}
