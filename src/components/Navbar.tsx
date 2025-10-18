// src/components/Navbar.tsx

import Link from "next/link";
import Image from "next/image";
import { SimpleAuth } from "./SimpleAuth";

/** 
 * Navbar component:
 * - Displays logo linking to home
 * - Shows main navigation links
 * - Includes user auth controls
 */
const Navbar = () => {
  return (
    <header className="bg-white shadow-sm font-work-sans">
      {/* Container with responsive horizontal padding */}
      <div className="px-2 sm:px-12">
        {/* Flex container: logo left, links + auth right */}
        <nav className="max-w-7xl mx-auto flex justify-between items-center py-4">
          
          {/* Logo linking to home */}
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={144} height={30} />
          </Link>

          {/* Navigation links and auth */}
          <div className="flex items-center gap-6">
            <Link href="/create" className="text-sm font-medium hover:text-primary">
              Add Service
            </Link>
            <Link href="/map" className="text-sm font-medium hover:text-primary">
              View Map
            </Link>
            <SimpleAuth />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
