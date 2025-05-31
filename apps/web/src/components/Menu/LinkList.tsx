import type { PropsWithChildren } from "react";


export function LinkList({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
