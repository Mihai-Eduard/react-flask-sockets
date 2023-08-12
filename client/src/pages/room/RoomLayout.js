import React from "react";
import InitialStageLayout from "../../components/room/initial-stage/InitialStageLayout";
import RaceLayout from "../../components/room/race/RaceLayout";
import { useSelector } from "react-redux";
import { getToken } from "../../utils/token";
import { useSubmit } from "react-router-dom";

const startRoomRequestOptions = (token) => {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

const RoomLayout = () => {
  const room = useSelector((state) => state.room);
  const [isRace, setIsRace] = React.useState(false);
  const submit = useSubmit();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [totalTime, setTotalTime] = React.useState(0);

  const startRaceHandler = () => {
    setIsSubmitting(true);
    fetch(
      `http://localhost:5000/api/room/${room["id"]}/start`,
      startRoomRequestOptions(getToken()),
    )
      .then((response) => {
        setIsSubmitting(false);
        if (response.status === 400) {
          setError("A race is already ongoing!");
          return;
        }
        if (response.status !== 200) throw new Error(String(response.status));
      })
      .catch((error) => {
        console.log(error);
        submit(
          { status: 500 },
          { method: "post", action: `/room/${room["id"]}` },
        );
      });
  };

  return (
    <>
      {!isRace && (
        <InitialStageLayout
          startRaceHandler={startRaceHandler}
          setIsRace={setIsRace}
          isSubmitting={isSubmitting}
          error={error}
          setTotalTime={setTotalTime}
        />
      )}
      {isRace && <RaceLayout totalTime={totalTime} setIsRace={setIsRace} />}
    </>
  );
};
export default RoomLayout;
