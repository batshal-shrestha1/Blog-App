import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return <div className="flex-1 p-8 max-w-4xl mx-auto w-full">{children}</div>;
}
