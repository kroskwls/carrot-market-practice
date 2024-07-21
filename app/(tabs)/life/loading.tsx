export default function Loading() {
  return (
    <div className="flex flex-col gap-5 p-5 animate-pulse">
      {[...Array(10)].map((_, index) => (
        <div className="flex flex-col gap-2 *:rounded-md" key={index}>
          <div className="bg-neutral-700 h-5 w-20"></div>
          <div className="bg-neutral-700 h-5 w-40"></div>
          <div className="flex gap-2 *:rounded-md">
            <div className="bg-neutral-700 h-5 w-5"></div>
            <div className="bg-neutral-700 h-5 w-5"></div>
          </div>
        </div>
      ))}
    </div>
  );
}