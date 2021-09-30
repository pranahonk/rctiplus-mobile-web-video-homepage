const initialState = {
  jsonLD: null
};

export const seoActionTypes = {
  SET_JSONLD: "SET_JSONLD"
}

export default (state = initialState, action) => {
  switch (action.type) {
    case seoActionTypes.SET_JSONLD:
      return {
        ...state,
        jsonLD: action.payload
      }
    default:
      return state;
  }
};