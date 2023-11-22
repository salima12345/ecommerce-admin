export default function Card({ data, label, icon }) {
    return (
      <div className="rounded-sm border border-stroke bg-black py-6 px-7.5 shadow">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full text-white bg-meta-2">
          {icon}
        </div>
        <div className="mt-4 flex items-center  justify-center">
          <div>
            <h4 className="text-title-md font-bold text-white">{data}</h4>
            <span className="text-sm font-medium text-white">{label}</span>
          </div>
        </div>
      </div>
    );
  }