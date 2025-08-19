import { fetchAtoms } from "../data/fetchData";

async function AtomsList() {
  const data = await fetchAtoms();
  if (!data)
    return <div className="text-white flex-center h-full">No atoms found</div>;
  return <div>{data.map((atom) => atom.title)}</div>;
}

export default AtomsList;
