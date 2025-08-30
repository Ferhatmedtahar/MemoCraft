import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function AtomsPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header stays on top */}
      <div className="">
        <h1 className="text-3xl font-bold text-foreground">Knowledge Graph</h1>
        <p className="text-muted-foreground mt-2">
          Visualized connections between your atoms and notes.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Clock /> Coming Soon
            </Card.Title>
            <Card.Description>
              Visualized connections between your atoms and notes.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-muted-foreground"></p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

// import { Card } from "@/components/ui/card";
// import { Clock } from "lucide-react";

// export default function AtomsPage() {
//   return (
//     <div className="h-screen flex flex-col items-center justify-center space-y-6">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold text-foreground">Knowledge Graph</h1>
//         <p className="text-muted-foreground mt-2">
//           Visualized connections between your atoms and notes.
//         </p>
//       </div>

//       <Card className="w-full max-w-md">
//         <Card.Header>
//           <Card.Title className="flex items-center gap-2">
//             <Clock /> Coming Soon
//           </Card.Title>
//           <Card.Description>
//             Visualized connections between your atoms and notes.
//           </Card.Description>
//         </Card.Header>
//         <Card.Content>
//           <p className="text-muted-foreground"></p>
//         </Card.Content>
//       </Card>
//     </div>
//   );
// }

// // import { Card } from "@/components/ui/card";
// // import { Clock } from "lucide-react";

// // export default function AtomsPage() {
// //   return (
// //     <div className="space-y-6 h-full">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-3xl font-bold text-foreground">
// //             Knowledge Graph
// //           </h1>
// //           <p className="text-muted-foreground mt-2">
// //             Visualized connections between your atoms and notes.
// //           </p>
// //         </div>
// //       </div>

// //       <Card className="">
// //         <Card.Header>
// //           <Card.Title className="flex items-center gap-2">
// //             <Clock /> Comming Soon
// //           </Card.Title>
// //           <Card.Description>
// //             Visualized connections between your atoms and notes.
// //           </Card.Description>
// //         </Card.Header>
// //         <Card.Content>
// //           <p className="text-muted-foreground"></p>
// //         </Card.Content>
// //       </Card>
// //     </div>
// //   );
// // }
