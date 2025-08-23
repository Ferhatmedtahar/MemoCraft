import { fetchAtomsByFolder } from "@/modules/dashboard/atoms/data/fetchData";

async function page({ params }: { params: Promise<{ folder: string }> }) {
  const { folder: folderId } = await params;
  const atoms = await fetchAtomsByFolder(folderId);

  return (
    <div>
      <pre>{JSON.stringify(atoms, null, 2)}</pre>
    </div>
  );
}

export default page;
