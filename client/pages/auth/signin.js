import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <form className="vh-100" onSubmit={onSubmit}>
      {errors}
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Sign In</h1>
          <p className="lead text-muted">
            Since this website is mostly for demo feel free to sign in with:{" "}
            <br />
            username: test@test.com
            <br />
            password: 1234
          </p>
        </div>
      </section>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: 1 }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-5">
                    Please enter your login and password!
                  </p>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="email"
                      id="typeEmailX"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control form-control-lg"
                    />
                    <label className="form-label" htmlFor="typeEmailX">
                      Email
                    </label>
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      id="typePasswordX"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control form-control-lg"
                    />
                    <label className="form-label" htmlFor="typePasswordX">
                      Password
                    </label>
                  </div>

                  <p className="small mb-5 pb-lg-2">
                    <a className="text-white-50" href="#!">
                      Forgot password?
                    </a>
                  </p>

                  <button
                    className="btn btn-outline-light btn-lg px-5"
                    type="submit"
                  >
                    Login
                  </button>
                </div>

                <div>
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <a href="/auth/signup" className="text-white-50 fw-bold">
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default signin;

{
  /* <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div classNameNameName="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          classNameNameName="form-control"
        />
      </div>
      <div classNameNameName="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          classNameNameName="form-control"
        />
      </div>
      {errors}
      <button classNameNameName="btn btn-primary">Sign In</button>
    </form> */
}
