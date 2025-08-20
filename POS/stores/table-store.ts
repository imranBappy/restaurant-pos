import { FLOOR_TABLE_TYPE } from '../graphql/product/types';
import { createStore } from 'zustand/vanilla';

export type TableAction = {
  addTable: (newTable: FLOOR_TABLE_TYPE[]) => void;
};

export type CounterStore = {
  table: FLOOR_TABLE_TYPE[];
} & TableAction;

export const defaultInitState: Omit<CounterStore, 'addTable'> = {
  table: [],
};

export const createCounterStore = (initState = defaultInitState) => {
  return createStore<CounterStore>((set) => ({
    ...initState,
    addTable: (newTable: FLOOR_TABLE_TYPE[]) =>
      set((state) => ({
        ...state,
        table: newTable,
      })),
  }));
};
