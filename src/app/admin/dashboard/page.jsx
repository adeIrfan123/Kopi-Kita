"use client";

import StatCard from "@/components/StatCard";
import AdminLayout from "@/app/AdminLayout";
import Link from "next/link";
import React from "react";
import ButtonAdd from "@/components/ButtonAdd";

function page() {
  return (
    <div>
      <AdminLayout>
        <div className="flex justify-between">
          <div>
            <h1 className="font-bold text-white text-3xl">
              Good Morning, Jhon De
            </h1>
            <span className="text-graye2 text-sm font-extralight">
              Keep brewing, one more espresso, one more smile!
            </span>
          </div>
          <div>
            <ButtonAdd href={"/admin/cart"} label={"New Order"} />
          </div>
        </div>
        <div className="my-8 flex gap-4">
          <StatCard
            label={"Revenu"}
            value={"Rp. 450.000"}
            status={"+12% vs Yesterday"}
          />
          <StatCard
            label={"Total Order"}
            value={"140"}
            status={"+10% vs Yesterday"}
          />
          <StatCard
            label={"Active Staff Today"}
            value={"8 Active"}
            status={""}
          />
          <StatCard
            label={"Beans Stock"}
            value={"12.4Kg"}
            status={"Low Alert"}
          />
        </div>
      </AdminLayout>
    </div>
  );
}

export default page;
