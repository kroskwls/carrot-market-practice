export default function Loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, index) => (
        <div className="flex gap-5 items-center" key={index}>
          <div className="bg-neutral-700 size-28 rounded-md"></div>
          <div className="flex flex-col gap-3 *:rounded-md">
            <div className="bg-neutral-700 h-5 w-40"></div>
            <div className="bg-neutral-700 h-5 w-20"></div>
            <div className="bg-neutral-700 h-5 w-10"></div>
          </div>
        </div>
      ))}
    </div>
  );
}