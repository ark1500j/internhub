import React from "react";

export default function Page({ params }: { params: { slug: string } }) {
  console.log(params.slug);
  return (
    <div>
      <div className="h-12 px-12 sticky top-0 py-1">Internhub</div>
    </div>
  );
}
