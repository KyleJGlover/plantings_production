import axios from "axios";
import { useState } from "react";

const deleteUseRequest = ({ method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const deleteDoRequest = async (props = {}) => {
    try {
      const url = `/api/plants/${props}`;

      setErrors(null);
      const response = await axios[method](url, body);

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

  return { deleteDoRequest, errors };
};

export default deleteUseRequest;
