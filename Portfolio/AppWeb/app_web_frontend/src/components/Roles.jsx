import { useState, useEffect } from "react";
import { getMe } from "../api/api";

function UseInfo({ token }) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    async function fetchMe() {
      try {
        const data = await getMe(token);
        setRoles(data.roles);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMe();
  }, [token]);

  return (
    <div>
      <p>
        Roles:{" "}
        {Array.isArray(user?.groups) ? user.groups.join(", ") : "Sin rol"}
      </p>
    </div>
  );
}
