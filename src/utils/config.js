export const api = "https://info-educ.herokuapp.com/api";

export const requestConfig = (method, data, xml = null) => {
    let config;
  
    if (xml) {
      config = {
        method: method,
        body: data,
        headers: {},
      };
    } else if (method === "DELETE" || data === null) {
      config = {
        method: method,
        headers: {},
      };
    } else {
      config = {
        method: method,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

  
    return config;
  };