// "use client";

// import { useSession } from "next-auth/react";

// export default function TestPage() {
//   const { data: session, status } = useSession();

//   if (status === "loading") {
//     return <div className="p-6">Loading user...</div>;
//   }

//   if (!session) {
//     return (
//       <div className="p-6">
//         <h1 className="text-xl font-semibold">Not Logged In</h1>
//         <p>Go to /login and sign in with Google.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">User Details</h1>

//       <div className="mb-4">
//         <p>
//           <strong>Name:</strong> {session.user?.name}
//         </p>
//         <p>
//           <strong>Email:</strong> {session.user?.email}
//         </p>
//         {session.user?.image && (
//           <img
//             src={session.user.image}
//             alt="Profile"
//             className="w-16 h-16 rounded-full mt-2"
//           />
//         )}
//       </div>

//       <h2 className="text-xl font-semibold mt-6 mb-2">Full Session Object</h2>
//       <pre className="p-4 bg-gray-100 rounded text-sm">
//         {JSON.stringify(session, null, 2)}
//       </pre>
//     </div>
//   );
// }

import { auth } from "@/auth";

export default async function TestPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Not Logged In</h1>
        <p>Please sign in using Google.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>

      <div className="mb-4">
        <p>
          <strong>Name:</strong> {session.user?.name}
        </p>
        <p>
          <strong>Email:</strong> {session.user?.email}
        </p>

        {session.user?.image && (
          <img
            src={session.user?.image}
            alt="profile"
            className="w-16 h-16 rounded-full mt-2"
          />
        )}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Full Session Object</h2>
      <pre className="p-4 bg-gray-100 rounded text-sm">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
