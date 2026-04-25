import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col overflow-x-hidden">
    <Header />
    <main className="flex-1 pt-[96px] lg:pt-[112px]">{children}</main>
    <Footer />
  </div>
);

export default Layout;
