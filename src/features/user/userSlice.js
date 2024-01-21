import {asyncThunkCreator, createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getAddress} from "../../services/apiGeocoding.js";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// This function should not be named like getAddress because that is reserved convention
// for selector functions.
// Now this createAsyncThunk() function is RTK way of creating a thunk, and it takes an action
// and an async function.
// This async function returns a promise, and we need to handle all its cases.

export const fetchAddress = createAsyncThunk("user/fetchAddress",
  async function(){
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address,
    // so we can display it the order form, so that the user can correct it if wrong.
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    // Payload of fulfilled state
    return { position, address };
  }
);

const initialState = {
  username: "",
  status: "ideal",
  position: {},
  address: "",
  error: "",
};

const userSlice = createSlice({
  name: "user", //name of the slice (global slice)
  initialState, //initial state of the slice
  reducers: {
    updateName(state, action){
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => (
    builder.addCase(
      fetchAddress.pending,
      (state, action) => {
        state.status = "loading"
      }
    ))
    .addCase(
      fetchAddress.fulfilled,
      (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "ideal";
      })
    .addCase(
      fetchAddress.rejected,
      (state, action) => {
        state.status = "error";
        state.error = action.error.message;
        console.error (action.error.message);
      }),
});

export const { updateName } = userSlice.actions;
export default userSlice.reducer;