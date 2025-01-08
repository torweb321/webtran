export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
      <a
        href="/webtran"
        className="mt-4 text-blue-500 hover:text-blue-700 underline"
      >
        Go back home
      </a>
    </div>
  );
}
