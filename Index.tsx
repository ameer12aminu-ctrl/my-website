import { useState } from "react";
import CornerNav from "@/components/CornerNav";
import HomePage from "@/components/HomePage";
import AboutPage from "@/components/AboutPage";
import AuthorPage from "@/components/AuthorPage";
import SystemPage from "@/components/SystemPage";
import CustomCursor from "@/components/CustomCursor";

type PageId = "home" | "about" | "author" | "system";

const pages: Record<PageId, React.ComponentType> = {
  home: HomePage,
  about: AboutPage,
  author: AuthorPage,
  system: SystemPage,
};

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageId>("home");
  const PageComponent = pages[currentPage];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent lg:pr-[20rem]">
      <CustomCursor />
      <CornerNav currentPage={currentPage} onPageChange={setCurrentPage} />
      <PageComponent />
    </div>
  );
};

export default Index;
