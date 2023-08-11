import React, { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import InternalServerError from "./InternalServerError";

const ActionErrorBoundary = () => {
  const error = useRouteError();
  useEffect(() => {
    console.log(error);
  }, [error]);

  if (error.status === 404) return <PageNotFound />;
  if (error.status === 500) return <InternalServerError />;
  return <div>{error.status}</div>;
};

export default ActionErrorBoundary;
