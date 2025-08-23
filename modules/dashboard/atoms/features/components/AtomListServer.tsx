// This should be your main page component (Server Component)
import { fetchAtoms, fetchFolders } from "../../data/fetchData";
import AtomsListClient from "../AtomsList";

async function AtomsPage() {
  // Fetch data in the server component
  const [data, foldersData] = await Promise.all([fetchAtoms(), fetchFolders()]);

  // Pass data to client component
  return (
    <AtomsListClient
      initialAtoms={data || []}
      initialFolders={foldersData || []}
    />
  );
}

export default AtomsPage;
