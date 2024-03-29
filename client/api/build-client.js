import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    // Local url: http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
    return axios.create({
      baseURL: "http://www.plantings.page",
      headers: req.headers,
    });
  } else {
    // We should be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClient;
