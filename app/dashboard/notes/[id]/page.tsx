import NoteIdScreen from "@/modules/dashboard/notes/noteID/NoteIdScreen";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <NoteIdScreen id={id} />;
}

export default page;
