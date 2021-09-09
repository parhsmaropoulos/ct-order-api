export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};
export const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer  ${process.env.REACT_APP_TOKEN}`,
  },
};

export const authHeaders = {};
