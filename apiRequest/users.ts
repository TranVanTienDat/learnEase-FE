import http from "@/lib/http";

const userRequest = {
  getUserDetail: () => http.get("/users/me"),
};

export default userRequest;
