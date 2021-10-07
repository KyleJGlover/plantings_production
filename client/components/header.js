import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const header = ({ currentUser }) => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Plants", href: "/plants/newPlant" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="p-2 text-light">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav>
      <div
        className={`${
          isNavCollapsed ? "collapse" : ""
        } navbar-collapse bg-dark`}
        id="navbarHeader"
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-7 py-4">
              <h4 className="text-white">About</h4>
              <p className="text-muted">
                This was an application made by Kyle Glover for demonstration of
                skills learned in developing microservices using Docker and
                Kubernetes. Services for authentication(Auth), NextJS (client),
                Expiration(expiration), Orders(orders), Payment using Stripe
                (payments), Plant Products(plants) were developed in their own
                pods (mini VM).
              </p>
            </div>
            <div className="col-sm-4 offset-md-1 py-4">
              <h4 className="text-white">Contact</h4>
              <ul className="list-unstyled">
                <li>
                  <a
                    target="_blank"
                    href="https://www.linkedin.com/in/kyle-glover-17041982/"
                    className="text-white"
                    rel="noreferrer"
                  >
                    See my LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://github.com/KyleJGlover"
                    className="text-white"
                    rel="noreferrer"
                  >
                    See my Github
                  </a>
                </li>
                <li>
                  <label className="text-white">
                    Email: kjglover4585@gmail.com
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar navbar-dark bg-dark box-shadow">
        <div className="container d-flex justify-content-between">
          <a href="/" className="navbar-brand d-flex align-items-center">
            <strong>Plantings</strong>
          </a>

          <ul className="nav d-flex align-items-center">
            {links}
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarHeader"
              aria-controls="navbarHeader"
              aria-expanded={!isNavCollapsed ? true : false}
              aria-label="Toggle navigation"
              onClick={handleNavCollapse}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default header;
