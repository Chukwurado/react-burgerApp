import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-burger-e06fa.firebaseio.com/"
});

export default instance;
