import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";
import { ThemeProvider } from "../Themes/ThemeContext";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <aside className="w-64 border-r bg-white dark:bg-gray-950 p-6 flex flex-col gap-8">
          <LeftMenu />
        </aside>
        <div className="flex-1 flex flex-col">
          <TopMenu query={query} />
          <Content>
            {children}
          </Content>
        </div>
      </div>
    </ThemeProvider>
  );
}
