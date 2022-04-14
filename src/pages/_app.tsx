import { SessionProvider, signIn, useSession } from 'next-auth/react';
import React from 'react';
import { useRouter } from 'next/router';
import Login from 'pages/auth/login';

export default function App({ Component, pageProps }) {
  return (
    <div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <Component {...pageProps} />
    </div>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isUser = !!session?.user;
  React.useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, status === 'loading']);
  if (isUser) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div />;
}
