export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};
export const authHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  Authorization: `Bearer  ${sessionStorage.getItem("token")}`,
};
