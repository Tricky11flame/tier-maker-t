export type Id = string | number;

export type color ="rose"|"red"|"orange"|"yellow"|"green"|"blue"|"indigo"|"violet"|"grey"|"pink";

export type Column = {
  id: Id;
  title: string;
  color: color;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};
