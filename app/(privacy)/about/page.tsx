function page() {
  return (
    <div>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="min-h-screen w-full relative">
          {/* Grid Background */}
          <div
            className="absolute inset-0 z-0 bg-primary/10"
            style={{
              backgroundImage: `
      linear-gradient(
  to right,
  color-mix(in oklab, var(--color-primary) 35%,transparent) 1px,
  transparent 1px
),p
linear-gradient(
  to bottom,
  color-mix(in oklab, var(--color-primary) 35%, transparent) 1px,
  transparent 1px
)
`,
              backgroundSize: "40px 40px",
            }}
          />
          {/* Your Content/Components */}
        </div>
      </div>
    </div>
  );
}

export default page;
