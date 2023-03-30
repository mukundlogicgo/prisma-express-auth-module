import UserCard from "@/components/UserCard";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NEXT_PUBLIC_SERVER_BASE_URL } from "./_app";

export default function Home() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  // log in user
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${NEXT_PUBLIC_SERVER_BASE_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(data.data);
        setIsLoggedIn(true);
      } catch (error) {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 404
        ) {
          router.replace("/auth/login");
        }
      }
    })();
  }, []);
  
  return <>{isLoggedIn && <UserCard user={user} />}</>;
}
