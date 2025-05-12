import { createSlice } from "@reduxjs/toolkit";

const BasicSlice = createSlice({
  name: "BasicSlice",
  initialState: {
    user: {},
  },

  reducers: {
    //! добавить в массив фильтрацию по заголовку
    setUser(state, action) {
      const { data } = action.payload;
      state.user = data;
    },
  },
});

export const { setUser } = BasicSlice.actions;

export default BasicSlice.reducer;
