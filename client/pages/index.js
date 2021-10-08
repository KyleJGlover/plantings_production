import { useState } from "react";
import Link from "next/link";
import { precise } from "./helper/functions.js";
import deleteUseRequest from "../hooks/delete-plants-use-request";
import Router from "next/router";

const LandingPage = ({ plants, currentUser }) => {
  const [filter, setFilter] = useState("");

  const { deleteDoRequest, errors } = deleteUseRequest({
    method: "delete",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  if (!currentUser) {
    currentUser = { id: "" };
  }

  const checkOwner = (plant) => {
    if (plants.length > 0) {
      if (currentUser.id === plant.plant.userId) {
        return (
          <button
            onClick={() => deleteDoRequest(plant.plant.id)}
            className="btn btn-danger"
            id="delete-button"
          >
            Delete
          </button>
        );
      }
    }
  };

  const buildProductCard = (plant) => {
    return (
      <div className="col-lg-4 col-md-6 col-sm-12" key={plant.plant.id}>
        <div className="box-border">
          <img className="thumbnail rounded" src={plant.URL} />
          <div className="box-element product">
            <h4>
              <strong>{plant.plant.title}</strong>
            </h4>
            <h6 className="body-description">
              <strong>Description: </strong>
              {plant.plant.description}
            </h6>
            <hr></hr>
            <div className="box-bottom">
              <div>
                {currentUser.id != "" ? (
                  <Link
                    href="/plants/[plantId]"
                    as={`/plants/${plant.plant.id}`}
                  >
                    <a className="btn btn-outline-secondary" id="show_plant">
                      View
                    </a>
                  </Link>
                ) : (
                  <Link href="/auth/signin">
                    <a className="btn btn-outline-secondary" id="show_plant">
                      View
                    </a>
                  </Link>
                )}
                {checkOwner(plant)}
              </div>
              <h2 className="body-text">${precise(plant.plant.price)}</h2>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const plantList = plants.map((plant) => {
    if (filter === "" || filter === "all") {
      return buildProductCard(plant);
    }
    console.log(filter);
    if (filter === plant.plant.category) {
      return buildProductCard(plant);
    }
  });

  // Might get rid of the description on this window since it's the cover
  return (
    <div>
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Plant Store</h1>
          <p className="lead text-muted">
            This will display all the current postings available on the site. If
            you see the red delete button that is because you are the owner of
            that specific order!
          </p>
          <p>
            <a href="/plants/newPlant" className="btn btn-primary my-2">
              Create a Post for Sale
            </a>
          </p>
        </div>
      </section>
      <div className="album py-5 bg-light">
        <div
          className="d-flex justify-content-center bd-highlight mb-2"
          id="category-selector"
        >
          <div
            className="btn-group"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio1"
              autoComplete="off"
              defaultChecked
              value="all"
              onChange={(e) => setFilter(e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio1">
              All
            </label>

            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio2"
              autoComplete="off"
              value="indoor"
              onChange={(e) => setFilter(e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio2">
              Indoor
            </label>

            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio3"
              autoComplete="off"
              value="outdoor"
              onChange={(e) => setFilter(e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="btnradio3">
              Outdoor
            </label>
          </div>
        </div>
        {errors}
        <div className="container">
          {plants.length > 0 ? (
            <div className="row">{plantList}</div>
          ) : (
            <h1 className="text-center">
              We are all sold out! <br /> Feel free to make a new sale. Thank
              you!
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/plants");

  return { plants: data };
};

export default LandingPage;
