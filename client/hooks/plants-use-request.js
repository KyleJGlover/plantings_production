import axios from "axios";
import { useState } from "react";

const plantUseRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const plantDoRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body, {
        hearders: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { plantDoRequest, errors };
};

export default plantUseRequest;
