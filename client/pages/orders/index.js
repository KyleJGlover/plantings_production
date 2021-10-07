import Link from "next/link";
import { precise } from "../helper/functions.js";

const OrderIndex = ({ orders }) => {
  const createdStatus = orders.map((order, ind) => {
    if (order.status === "created") {
      return (
        <tr key={order.id}>
          <th scope="row">{ind + 1}</th>
          <td>{order.plant.title}</td>
          <td>{order.status}</td>
          <td>${precise(order.plant.price)}</td>
          <td>
            <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
              <a>My Order</a>
            </Link>
          </td>
        </tr>
      );
    }
  });

  const awaitingStatus = orders.map((order, ind) => {
    if (order.status === "awaiting:payment") {
      return (
        <tr key={order.id}>
          <th scope="row">{ind + 1}</th>
          <td>{order.plant.title}</td>
          <td>{order.status}</td>
          <td>${precise(order.plant.price)}</td>
        </tr>
      );
    }
  });

  const completedStatus = orders.map((order, ind) => {
    if (order.status === "complete") {
      return (
        <tr key={order.id}>
          <th scope="row">{ind + 1}</th>
          <td>{order.plant.title}</td>
          <td>{order.status}</td>
          <td>${precise(order.plant.price)}</td>
        </tr>
      );
    }
  });

  const cancelledStatus = orders.map((order, ind) => {
    if (order.status === "cancelled") {
      return (
        <tr key={order.id}>
          <th scope="row">{ind + 1}</th>
          <td>{order.plant.title}</td>
          <td>{order.status}</td>
          <td>${precise(order.plant.price)}</td>
        </tr>
      );
    }
  });

  return (
    <div>
      <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1 className="display-4">Orders</h1>
        <p className="lead">
          This section will display all the current user owns.These will be
          displayed as Created(active), AwaitingPayment(processed),
          Completed(payment confirmed through stripe)
        </p>
      </div>
      <div className="card-deck mb-3">
        <div className="card mb-4 box-shadow">
          <div className="card-header">
            <h4 className="my-0 font-weight-normal text-center">Created</h4>
          </div>
          <div>
            {orders.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Price</th>
                    <th scope="col">Link</th>
                  </tr>
                </thead>
                <tbody>{createdStatus}</tbody>
              </table>
            ) : (
              <div className="text-center">No Created Orders </div>
            )}
          </div>
        </div>
        <div className="card mb-4 box-shadow">
          <div className="card-header">
            <h4 className="my-0 font-weight-normal text-center">
              Awaiting Payment
            </h4>
          </div>
          <div>
            {orders.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>{awaitingStatus}</tbody>
              </table>
            ) : (
              <div className="text-center">No Created Orders </div>
            )}
          </div>
        </div>
        <div className="card mb-4 box-shadow">
          <div className="card-header">
            <h4 className="my-0 font-weight-normal text-center">Complete</h4>
          </div>
          <div>
            {orders.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>{completedStatus}</tbody>
              </table>
            ) : (
              <div className="text-center">No Completed Orders </div>
            )}
          </div>
        </div>
        <div className="card mb-4 box-shadow">
          <div className="card-header">
            <h4 className="my-0 font-weight-normal text-center">Cancelled</h4>
          </div>
          <div>
            {orders.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>{cancelledStatus}</tbody>
              </table>
            ) : (
              <div>No Cancelled Orders </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
