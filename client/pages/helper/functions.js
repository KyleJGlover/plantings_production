import Link from "next/link";

export function precise(x) {
  return Number.parseFloat(x).toPrecision(4);
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

export function buildProductCard(plant) {
  return (
    <div className="col-lg-3 col-md-4 col-sm-12" key={plant.plant.id}>
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
                <Link href="/plants/[plantId]" as={`/plants/${plant.plant.id}`}>
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
}
