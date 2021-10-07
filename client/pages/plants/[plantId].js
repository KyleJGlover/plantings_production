import useRequest from "../../hooks/use-request";
import Router from "next/router";
import { precise } from "../helper/functions";

const PlantShow = ({ plant }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      plantId: plant.plant.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div className="container">
      <div className="row mb-1">
        <div className="col-md-12">
          <div
            className="card flex-md-row mb-4 box-shadow h-md-250"
            id="card_container"
          >
            <div className="card-body d-flex flex-column align-items-start">
              <h3 className="mb-0">
                <label className="text-dark">
                  <b>Title: </b>
                  {plant.plant.title}
                </label>
              </h3>
              <h3 className="card-text mb-auto">
                <hr />
                <b>Description: </b>
                <small>{plant.plant.description}</small> <br />
                <hr />
                <b>Price:</b> <small>{precise(plant.plant.price)} </small>
                <br />
                <hr />
                <b>Owner:</b> <small>{plant.plant.owner}</small> <hr />
              </h3>
              <button
                onClick={() => doRequest()}
                className="btn btn-lg btn-primary"
              >
                Purchase
              </button>
            </div>

            <img
              className="card-img-right flex-auto d-md-block w-50"
              src={plant.URL}
              alt="Card image cap"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

PlantShow.getInitialProps = async (context, client) => {
  //from our query when calling this link
  const { plantId } = context.query;

  const { data } = await client.get(`/api/plants/${plantId}`);

  return { plant: data };
};

export default PlantShow;
