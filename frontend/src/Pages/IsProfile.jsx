import React, { useEffect } from "react";
import axios from "axios";

const IsProfile = () => {
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = localStorage.getItem("userId");

        const res = await axios.get(
          `http://localhost:8989/profile/profile-exist/${id}`
        );

        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Profile Check</h2>
    </div>
  );
};

export default IsProfile;