import { fetchAtoms, fetchFolders } from "../../data/fetchData";
import AtomsListClient from "../AtomsList";

async function AtomsPage() {
  const [data, foldersData] = await Promise.all([fetchAtoms(), fetchFolders()]);

  return (
    <AtomsListClient
      initialAtoms={data || []}
      initialFolders={foldersData || []}
    />
  );
}

export default AtomsPage;
