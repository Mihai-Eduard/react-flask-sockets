import React, { useEffect, useState } from "react";
import { json, useLocation, useSubmit } from "react-router-dom";
import Loading from "../utils/Loading";
import { getToken } from "../../utils/token";
import RoomLayout from "./RoomLayout";
import { useDispatch } from "react-redux";
import { roomActions } from "../../store/room-slice";

function getRoomID(url) {
  return url.split("/")[2];
}

const requestOptions = (token) => {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

const VerifyRoom = () => {
  const [content, setContent] = useState(<Loading />);
  const location = useLocation();
  const submit = useSubmit();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("verifying the room...");
    const verifyRoom = async () => {
      const room_id = getRoomID(location.pathname);
      let response = null;
      try {
        response = await fetch(
          `http://localhost:5000/api/room/${room_id}`,
          requestOptions(getToken()),
        );
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
          dispatch(roomActions.setRoom(data));
          setContent(<RoomLayout />);
          return;
        }
      } catch (error) {
        console.log(error);
      }
      submit(
        { status: response.status === 404 ? 404 : 500 },
        { method: "post", action: `/room/${room_id}` },
      );
    };

    verifyRoom();
  }, [submit, location.pathname, dispatch]);

  return content;
};

export default VerifyRoom;

export async function verifyRoomAction({ request }) {
  let status = null;
  try {
    status = (await request.formData()).get("status");
  } catch (error) {
    console.log(error);
  }
  console.log(status);
  if (status === "404")
    throw json({ message: "The room doesn't exist." }, { status: 404 });
  throw json({ message: "There was a server error." }, { status: 500 });
}
