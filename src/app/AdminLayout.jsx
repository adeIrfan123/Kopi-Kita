"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function AdminLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/categories", label: "Manage Categories" },
    { path: "/admin/products", label: "Manage Products" },
    { path: "/admin/kasir", label: "Kasir" },
    { path: "/admin/cart", label: "Cart" },
    { path: "/admin/transaction", label: "Transaction" },
    { path: "/admin/staff-Schedule", label: "Staff Schedule" },
    { path: "/admin/pengaturan", label: "Settings" },
  ];

  const activeMenu = menuItems.find(
    (menu) => pathname === menu.path || pathname.startsWith(`${menu.path}/`),
  );

  let headerTitle = activeMenu ? activeMenu.label : "Dashboard";

  if (pathname.includes("/add-category")) {
    headerTitle = "Add New Category";
  } else if (pathname.includes("/edit-category")) {
    headerTitle = "Edit Category";
  } else if (pathname.includes("/add-product")) {
    headerTitle = "Add New Product";
  } else if (pathname.includes("/edit-product")) {
    headerTitle = "Edit Product";
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-gray-800">
      <aside className="w-54 shrink-0 bg-[#120E0B] border-r border-[#251C18] flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-[#251C18]">
          <h1 className="text-xl font-bold text-orange-600">Kopi Kita</h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((menu) => {
            const isActive =
              pathname === menu.path || pathname.startsWith(`${menu.path}/`);

            return (
              <Link
                key={menu.label}
                href={menu.path}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-orange2 text-black font-bold"
                    : "text-graye2 hover:bg-orange2/10 hover:text-white"
                }`}
              >
                {menu.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button className="w-full px-4 py-2 text-left text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex-shrink-0 bg-[#120E0B] border-b border-[#251C18] flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-white">{headerTitle}</h2>

          <div className="flex items-center gap-3">
            <div className="text-white bg-[#181310] px-3 py-2 rounded-xl border border-[#251C18]">
              <label htmlFor="shift" className="mr-2 text-sm">
                Shift
              </label>
              <select
                name="shift"
                id="shift"
                className="bg-transparent outline-none"
              >
                <option value="pagi" className="bg-[#251C18]">
                  Pagi
                </option>
                <option value="siang" className="bg-[#251C18]">
                  Siang
                </option>
                <option value="malam" className="bg-[#251C18]">
                  Malam
                </option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">
                Halo, Admin
              </span>
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-4 bg-[#0B0806]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
