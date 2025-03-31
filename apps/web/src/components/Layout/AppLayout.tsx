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
      <LeftMenu />
      <Content>
        <TopMenu query={query} />
        {children}
      </Content>
    </ThemeProvider>
  );
}
