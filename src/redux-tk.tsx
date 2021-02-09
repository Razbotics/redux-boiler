import {
  combineReducers,
  configureStore,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { v1 as uuid } from "uuid";
import { Todo } from "./type";

export const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: "Learn React",
    isComplete: true,
  },
  {
    id: uuid(),
    desc: "Learn Redux",
    isComplete: true,
  },
  {
    id: uuid(),
    desc: "Learn Redux-ToolKit",
    isComplete: false,
  },
];

const todoSlice = createSlice({
  name: "todos",
  initialState: todosInitialState,
  reducers: {
    create: {
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
      reducer: (state, { payload }: PayloadAction<Todo>) => {
        state.push(payload);
      },
    },
    edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
      const todo = state.find((todo) => todo.id === payload.id);
      if (todo) todo.desc = payload.desc;
    },
    toggle: (
      state,
      { payload }: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const todo = state.find((todo) => todo.id === payload.id);
      if (todo) todo.isComplete = payload.isComplete;
    },

    delete: (state, { payload }: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === payload.id);
      if (index !== -1) state.splice(index, 1);
    },
  },
});

const selectedTodoSlice = createSlice({
  name: "selectedTodo",
  initialState: null as string | null,
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id,
  },
});

const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todoSlice.actions.create.type]: (state) => state + 1,
    [todoSlice.actions.delete.type]: (state) => state + 1,
    [todoSlice.actions.toggle.type]: (state) => state + 1,
    [todoSlice.actions.edit.type]: (state) => state + 1,
  },
});

const reducer = combineReducers({
  todos: todoSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
});

export const {
  create: createTodoActionCreator,
  delete: deleteTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
} = todoSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

export default configureStore({
  reducer,
});
