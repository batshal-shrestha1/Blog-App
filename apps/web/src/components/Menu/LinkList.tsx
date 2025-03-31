import type { PropsWithChildren } from "react";


export function LinkList({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
