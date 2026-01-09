export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      id="auth-board"
      className={`flex items-center justify-center min-h-screen w-full `}
    >
      <div id="auth-container" className="mx-4 w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}
