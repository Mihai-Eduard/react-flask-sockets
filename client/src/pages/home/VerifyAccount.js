import React, { useEffect, useState } from "react";
import { json, useFetcher, useLocation, useNavigate } from "react-router-dom";
import Loading from "../utils/Loading";
import HomeLayout from "./HomeLayout";
import { getToken } from "../../utils/token";
import { userDetailsActions } from "../../store/user-details-slice";
import { useDispatch } from "react-redux";

const requestOptions = (token) => {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

const VerifyAccount = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(<Loading />);
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("verifying...");
    const verifyUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/user",
          requestOptions(getToken()),
        );
        const data = await response.json();
        if (response.status === 401 || response.status === 422)
          return navigate("/login");
        if (response.status === 200) {
          console.log(data);
          dispatch(userDetailsActions.setID({ id: data.id }));
          dispatch(userDetailsActions.setEmail({ email: data.email }));
          dispatch(userDetailsActions.setUsername({ username: data.username }));
          setIsLoading(false);
          setContent(<HomeLayout />);
          return;
        }
      } catch (error) {
        console.log(error);
      }
      fetcher.submit({}, { method: "post", action: "/" });
    };

    verifyUser();
  }, [fetcher, navigate, dispatch]);

  useEffect(() => {
    if (location.pathname === "/" && isLoading === false)
      return navigate("/dashboard");
  }, [navigate, location.pathname, isLoading]);

  return content;
};

export default VerifyAccount;

export async function verifyAccountAction() {
  throw json({ message: "There was a server error." }, { status: 500 });
}
