import { configureStore } from '@reduxjs/toolkit';
import { brickReducer } from './reducers/brick';
import { wallReducer } from './reducers/wall';

export const store = configureStore({
  reducer: {
    brick: brickReducer,
    wall: wallReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// import { createStore } from "redux";
// import rootReducer from './reducers';
// import { composeWithDevTools } from 'redux-devtools-extension';

// // export default createStore(rootReducer);
// export default createStore(rootReducer, composeWithDevTools());


