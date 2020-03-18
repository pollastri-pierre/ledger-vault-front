// @flow

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "redux/modules/auth";
import VaultCentered from "components/VaultCentered";
import Card from "components/base/Card";

const Logout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    const effect = async () => {
      try {
        await dispatch(logout());
        if (process.env.NODE_ENV === "production") {
          window.location.href = "/";
        } else {
          history.replace("/");
        }
      } catch (err) {
        console.error(err);
      }
    };
    effect();
  }, [dispatch, history]);
  return (
    <VaultCentered>
      <Card width={540} height={350} align="center" justify="center">
        Logging out...
      </Card>
    </VaultCentered>
  );
};

export default Logout;
