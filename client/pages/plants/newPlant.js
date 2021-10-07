import { useState } from "react";
import plantUseRequest from "../../hooks/plants-use-request";
import FormData from "form-data";

import Router from "next/router";

const newPlant = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setpreviewImage] = useState(null);
  const data = new FormData();

  const { plantDoRequest, errors } = plantUseRequest({
    url: "/api/plants",
    method: "post",
    body: data,
    onSuccess: () => Router.push("/"),
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setpreviewImage(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    data.append("title", title);
    data.append("description", description);
    data.append("price", price);
    data.append("image", image);

    plantDoRequest();
  };

  return (
    <div className="container">
      <h1>Create a Plant</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="custom-file mb-3">
            <label>Image</label>
            <input
              className="form-control"
              type="file"
              onChange={onChangePicture}
            />
          </div>
          <img className="img-responsive" src={previewImage} />
        </div>

        <button className="btn btn-primary btn btn-block" type="submit">
          Submit
        </button>
        {errors}
      </form>
    </div>
  );
};
export default newPlant;
