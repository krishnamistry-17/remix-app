export function Welcome() {
  const resources = [
    {
      text: "React Router Docs",
    },
    {
      text: "Join Discord",
    },
  ];

  return (
    <main className=" pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6  text-center">What&apos;s next?</p>
            <ul>
              {resources.map(({ text }) => (
                <li key={text}>
                  <a
                    className="group flex items-center gap-3 self-stretch p-3 leading-normal
                     text-blue-700 hover:underline dark:text-blue-500"
                    href={`https://reactrouter.com/docs/${text}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
