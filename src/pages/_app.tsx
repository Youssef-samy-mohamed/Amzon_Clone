import "@/styles/globals.css";
import type { AppProps } from "next/app";
import RootLayout from '../components/RootLayout'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Provider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";





export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SessionProvider session={session}>
          <RootLayout>
            <div className="font-bodyFont bg-gray-400">
              <Component {...pageProps} />
            </div>
          </RootLayout>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}







