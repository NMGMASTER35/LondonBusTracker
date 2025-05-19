import { Link } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const isMobile = useIsMobile();

  const NavLinks = () => (
    <div className="flex gap-6">
      <Link href="/">
        <span className="cursor-pointer">Dashboard</span>
      </Link>
      <Link href="/live-arrivals">
        <span className="cursor-pointer">Live Arrivals</span>
      </Link>
      <Link href="/service-status">
        <span className="cursor-pointer">Service Status</span>
      </Link>
      <Link href="/vehicle-search">
        <span className="cursor-pointer">Vehicle Search</span>
      </Link>
      <Link href="/journey-planner">
        <span className="cursor-pointer">Journey Planner</span>
      </Link>
    </div>
  );

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">London Transit</span>
          </Link>
          {!isMobile && <NavLinks />}
        </div>
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks />
                <Link href="/profile">
                  <span className="cursor-pointer">Profile</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Link href="/profile">
            <span className="cursor-pointer">Profile</span>
          </Link>
        )}
      </div>
    </nav>
  );
}