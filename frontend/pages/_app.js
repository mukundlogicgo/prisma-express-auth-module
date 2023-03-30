import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// export server base url
export const NEXT_PUBLIC_SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL;

// next js app
export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleOAuthProvider clientId="947665010083-ljnje96r98s2i00at02us6qp3lvd5k84.apps.googleusercontent.com">
        <Component {...pageProps} />
      </GoogleOAuthProvider>
    </>
  );
}
